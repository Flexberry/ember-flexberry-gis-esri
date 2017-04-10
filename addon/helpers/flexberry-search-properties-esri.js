import Ember from 'ember';

export function flexberrySearchPropertiesEsri([url, field]) {
  return {
    apiSettings: {
      url: url + '?returnGeometry=true&where=' + field + '+like+\'%{query}%\'&f=json',
      beforeSend(settings) {
        settings.urlData.query = settings.urlData.query.replace(/ /g, '%25');
        return settings;
      },
      onResponse(results) {
        results.features.forEach((feature) => {
          feature[field] = feature.attributes[field];
        });

        results.features = results.features.sort(function (a, b) {
          if (a[field] > b[field]) {
            return 1;
          }

          if (a[field] < b[field]) {
            return -1;
          }

          return 0;
        });

        return results;
      }
    },
    fields: {
      results: 'features',
      title: field
    },
    minCharacters: 3
  };
}

export default Ember.Helper.helper(flexberrySearchPropertiesEsri);
