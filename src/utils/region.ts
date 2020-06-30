import request from "@/utils/axiosReques";

export function getRegions2() {
  return new Promise(function (resolve, reject) {
    fetchRegion({level: 1}).then((res) => {
      let regions = res.data.data.map(_ => ({value: _.id, label: _.name, isLeaf: false}));
      resolve(regions);
    }).catch(error => {
      reject(error);
    })
  })
}

export function getRegions(regionCodes?) {
  let provinceCode = regionCodes ? regionCodes[0] : undefined;
  let cityCode = regionCodes ? regionCodes[1] : undefined;
  return new Promise(function (resolve, reject) {
    fetchRegion({level: 1}).then((res) => {
      let provinces = res.data.data.map(_ => ({value: _.id, label: _.name, isLeaf: false}));
      if (provinceCode) {
        // load city
        let province = find(provinces, provinceCode);
        fetchRegion({pid: provinceCode}).then((city_res) => {
          let cities = city_res.data.data.map(_ => ({value: _.id, label: _.name, isLeaf: false}));
          province.children = cities;
          if (cityCode) {
            // load area
            let city = find(cities, cityCode);
            fetchRegion({pid: cityCode}).then((area_res) => {
              let areas = area_res.data.data.map(_ => ({value: _.id, label: _.name}));
              city.children = areas;
              resolve(provinces);
            }).catch(error => {
              reject(error);
            });
          } else {
            resolve(provinces);
          }
        }).catch(error => {
          reject(error);
        })
      } else {
        resolve(provinces);
      }
    }).catch(error => {
      reject(error);
    })
  })
}


export function loadRegionData(selectedOptions) {
  return new Promise(function (resolve, reject) {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    fetchRegion({pid: targetOption.value}).then((res) => {
      targetOption.loading = false;
      if (selectedOptions.length < 2) {
        targetOption.children = res.data.data.map(_ => ({value: _.id, label: _.name, isLeaf: false}));
      } else {
        targetOption.children = res.data.data.map(_ => ({value: _.id, label: _.name}));
      }
      resolve();
    }).catch(error => {
      reject(error);
    })
  })
}

function find(regions, regionCode) {
  return regions.find(_ => _.value == regionCode);
}

function fetchRegion(params) {
  return request.get(`/manager-service/v1/region/getAll`, {params});
}
