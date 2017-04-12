L.esri.DynamicMapLayer.Extended = L.esri.DynamicMapLayer.extend({
  options: {
    zIndex: 1
  },
  _renderImage: function (url, bounds, contentType) {
    if (this._map) {
      // if no output directory has been specified for a service, MIME data will be returned
      if (contentType) {
        url = 'data:' + contentType + ';base64,' + url;
      }
      // create a new image overlay and add it to the map
      // to start loading the image
      // opacity is 0 while the image is loading
      var image = L.imageOverlayExtended(url, bounds, {
        opacity: 0,
        crossOrigin: this.options.useCors,
        alt: this.options.alt,
        pane: this.options.pane || this.getPane(),
        interactive: this.options.interactive
      }).addTo(this._map);

      // once the image loads
      image.once('load', function (e) {
        if (this._map) {
          var newImage = e.target;
          var oldImage = this._currentImage;

          // if the bounds of this image matches the bounds that
          // _renderImage was called with and we have a map with the same bounds
          // hide the old image if there is one and set the opacity
          // of the new image otherwise remove the new image
          if (newImage._bounds.equals(bounds) && newImage._bounds.equals(this._map.getBounds())) {
            this._currentImage = newImage;

            if (this.options.position === 'front') {
              this.bringToFront();
            } else {
              this.bringToBack();
            }

            if (this._map && this._currentImage._map) {
              this._currentImage.setOpacity(this.options.opacity);
              this._currentImage.setZIndex(this.options.zIndex);
            } else {
              this._currentImage._map.removeLayer(this._currentImage);
            }

            if (oldImage && this._map) {
              this._map.removeLayer(oldImage);
            }

            if (oldImage && oldImage._map) {
              oldImage._map.removeLayer(oldImage);
            }
          } else {
            this._map.removeLayer(newImage);
          }
        }

        this.fire('load', {
          bounds: bounds
        });
      }, this);

      this.fire('loading', {
        bounds: bounds
      });
    }
  },

  setZIndex: function (zIndex) {
    this.options.zIndex = zIndex;
    if (this._currentImage) {
      this._currentImage.setZIndex(zIndex);
    }
  }
});

L.esri.dynamicMapLayerExtended = function (options) {
  return new L.esri.DynamicMapLayer.Extended(options);
};
