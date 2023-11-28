var glacier = ee.FeatureCollection("path_to_rgi7_region_glacier_outline_on_google_earth_engine_platform");

// Map.centerObject(glacier, 4);

// Define AOI based on the glacier collection
var AOI = glacier;

// Load and filter MODIS Terra and Aqua data for the date range
var filter_mod = ee.ImageCollection("MODIS/061/MOD10A1")
        .filter(ee.Filter.date('2000-02-24', '2023-01-01'))
        .select('Snow_Albedo_Daily_Tile');

var filter_myd = ee.ImageCollection('MODIS/061/MYD10A1')
        .filter(ee.Filter.date('2002-07-04', '2023-01-01'))
        .select('Snow_Albedo_Daily_Tile');

// Clip MODIS data to the AOI
var mod = filter_mod.map(function(img){return img.clip(AOI)});
var myd = filter_myd.map(function(img){return img.clip(AOI)});

// Define reducer, scale, and CRS for mean albedo calculation
var meanReducer = ee.Reducer.mean();
var scale = 500;
var crs = 'EPSG:4326';

// Calculate mean albedo for MODIS Terra within AOI
var mod_mean = mod.map(function(image){
  return image.reduceRegions({
    collection: AOI,
    reducer: meanReducer,
    scale: scale,
    crs: crs,
  }).map(function(feature) {
    return feature.set({satellite: 'MODIS_Terra', date: image.date().format('YYYY-MM-dd'), mean: feature.get('mean')});
  });
});

// Calculate mean albedo for MODIS Aqua within AOI
var myd_mean = myd.map(function(image){
    return image.reduceRegions({
      collection: AOI,
      reducer: meanReducer,
      scale: scale,
      crs: crs,
    }).map(function(feature) {
      return feature.set({satellite: 'MODIS_Aqua', date: image.date().format('YYYY-MM-dd'), mean: feature.get('mean')});
    });
});

// Merge Terra and Aqua mean albedo data
var combined_mean = mod_mean.merge(myd_mean).flatten();

// Export the combined albedo data to Google Drive as a CSV
Export.table.toDrive({
  collection: combined_mean,
  description: 'region_name_albe_2000_2022',
  folder: 'AOI',
  selectors: ['system:index', 'satellite', 'date', 'mean'],
  fileFormat: 'CSV'
});