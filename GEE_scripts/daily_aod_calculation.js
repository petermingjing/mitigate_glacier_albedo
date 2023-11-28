var glacier = ee.FeatureCollection("path_to_rgi7_region_glacier_outline_on_google_earth_engine_platform");

var AOI = /* color: #0b4a8b */ee.Geometry.Polygon(
        [[point_coordinates]]);

// Center the map on the AOI and add layers
Map.centerObject(AOI, 6);
Map.addLayer(glacier, {color: 'blue', opacity: 0.5}, 'Glacier');
Map.addLayer(AOI, {color: 'red', opacity: 0.5}, 'AOI');

// Filter the ImageCollection for the desired date range and AOI
var filter = ee.ImageCollection('MODIS/061/MCD19A2_GRANULES')
                  .filterBounds(AOI)
                  .filter(ee.Filter.date('2000-01-01', '2023-01-01'))
                  .select('Optical_Depth_055');

// Clip images to AOI
var aod = filter.map(function(img) {
    return img.clip(AOI);
});

// Add formatted date to each image
var aod_with_date = aod.map(function(image) {
    var date = ee.Date(image.get('system:time_start'));
    return image.set('date', date.format('YYYY-MM-dd'));
});

// Display start and end dates
var start_date = ee.Date(aod_with_date.first().get('date'));
var end_date = ee.Date(aod_with_date.sort('system:time_start', false).first().get('date'));
print('Start Date:', start_date);
print('End Date:', end_date);

// Sample images from the year 2000
var filter_2000 = ee.ImageCollection('MODIS/061/MCD19A2_GRANULES')
                  .filterBounds(AOI)
                  .filter(ee.Filter.date('2000-01-01', '2000-03-01'))
                  .select('Optical_Depth_055');

var firstImageDate = ee.Date(filter_2000.first().get('system:time_start'));
print('Date of the first image:', firstImageDate);

var sampleImages2000 = filter_2000.toList(5); // Get the first 5 images from the year 2000
for (var i = 0; i < 5; i++) {
    var image = ee.Image(sampleImages2000.get(i));
    print(image.get('system:index'), image.get('system:time_start'));
}

// Calculate mean AOD over the AOI for each image
var aod_mean = aod_with_date.map(function(image){
    return image
        .reduceRegions({
            collection: AOI,
            reducer: ee.Reducer.mean(),
            scale: 1000
        })
        .map(function(feature) {
            return feature.set('date', image.get('date'));
        });
});

// Export the result as CSV
Export.table.toDrive({
    collection: aod_mean.flatten(),
    description: 'aod061_region_name',
    folder: 'AOI',
    selectors: ['system:index', 'date', 'mean'],
    fileFormat: 'CSV'
});