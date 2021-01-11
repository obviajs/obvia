var _initDbModal = async () => {
  let api_rs = GaiaAPI_report_source.getInstance();
  
  //save to cache so you don't make the call to the api more than once for the selected time
  let cache = new Cache({ttl: 3600000});
  if (!cache.get("datasourceList")) {
    let res = await api_rs.report_sourceClient.get()
    if (!res.status_description) {
      cache.set("datasourceList", res);
      cache.persist();
    } else {
      console.error(res.status_description, 'Error inside _initDbModal')
    }
  }

  return Promise.resolve(Builder)
};