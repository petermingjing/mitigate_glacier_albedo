var aoi = ee.FeatureCollection("path_to_rgi7_region_glacier_outline_on_google_earth_engine_platform");

var temp_snow_collection = ee.ImageCollection("ECMWF/ERA5_LAND/DAILY_AGGR");

// load temperature, precipitation and aod
var temp_filter = temp_snow_collection.filter(ee.Filter.date('2000-01-01', '2023-01-01'))
            .filterBounds(aoi)
            .select('temperature_2m');
var snow_filter = temp_snow_collection.filter(ee.Filter.date('2000-01-01', '2023-01-01'))
            .filterBounds(aoi)
            .select('total_precipitation_sum');

// Clip to aoi
var clippedtemp = temp_filter.map(function(image){return image.clip(aoi);});
var clippedsnow = snow_filter.map(function(image){return image.clip(aoi);});

// Calculate daily mean of temperature, precipitation and aod, and add date property
var temp_mean = clippedtemp.map(function(image){
  return image.reduceRegions({
    collection: aoi,
    reducer: ee.Reducer.mean(),
    scale: 11132,
    crs: 'EPSG:4326'
  }).map(function(feature) {
    return feature.set('date', image.date().format('YYYY-MM-dd'));
  });
});

var snow_mean = clippedsnow.map(function(image){
  return image.reduceRegions({
    collection: aoi,
    reducer: ee.Reducer.mean(),
    scale: 11132,
    crs: 'EPSG:4326'
  }).map(function(feature) {
    return feature.set('date', image.date().format('YYYY-MM-dd'));
  });
});

// Flatten the FeatureCollections and merge them by date
var temp_flat = temp_mean.flatten();
var snow_flat = snow_mean.flatten();

var temp_snow_join = ee.Join.saveFirst('snow').apply({
  primary: temp_flat,
  secondary: snow_flat,
  condition: ee.Filter.equals({
    leftField: 'date',
    rightField: 'date'
  })
});

// Prepare the data for export
var export_data = temp_snow_join.map(function(feature) {
  return ee.Feature(null, {
    date: feature.get('date'),
    temperature: feature.get('mean'),
    precipitation: ee.Feature(feature.get('snow')).get('mean')
  });
});

// Export to drive
Export.table.toDrive({
  collection: export_data,
  description: 'region_name_TndP',
  folder: 'AOI',
  selectors: ['date', 'temperature', 'precipitation'],
  fileFormat: 'CSV'
});