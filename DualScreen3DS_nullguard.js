/*:
 * @plugindesc DualScreen3DS background image guard for stage transitions
 * @author GitHub Copilot
 * @help
 * Prevents "Cannot read property 'trim' of null" error when advancing stages
 * in a stage battle and the background image fails to load or is not ready.
 *
 * Place this plugin BELOW DualScreen3DS.js in the Plugin Manager.
 *
 */

(() => {
  const PLUGIN_NAME = 'DualScreen3DS_nullguard';

  // Wait for Sprite_Corridor3D to be defined
  const waitForSprite = () => {
    if (!window.Sprite_Corridor3D || !window.Sprite_Corridor3D.prototype) {
      setTimeout(waitForSprite, 50);
      return;
    }
    patchSpriteCorridor3D();
  };

  const patchSpriteCorridor3D = () => {
    const proto = window.Sprite_Corridor3D.prototype;

    // Store original methods
    const _orig_initialize = proto.initialize;
    const _orig_update = proto.update;

    // Patch initialize to ensure bitmap is never null
    proto.initialize = function() {
      _orig_initialize.call(this);
      
      // Ensure bitmap exists and is valid
      if (!this.bitmap) {
        this.bitmap = new Bitmap(1, 1);
        this.bitmap.fillAll('rgba(0, 0, 0, 0)');
      }
    };

    // Patch update to catch texture errors during stage transitions
    proto.update = function() {
      try {
        // Ensure bitmap is always valid before update
        if (!this.bitmap || this.bitmap === null || this.bitmap === undefined) {
          this.bitmap = new Bitmap(1, 1);
          this.bitmap.fillAll('rgba(0, 0, 0, 0)');
        }

        // Call original update
        if (_orig_update) {
          _orig_update.call(this);
        }
      } catch (e) {
        console.warn(`[${PLUGIN_NAME}] Error in Sprite_Corridor3D.update:`, e);
        
        // Fallback: ensure bitmap is valid
        if (!this.bitmap) {
          this.bitmap = new Bitmap(1, 1);
          this.bitmap.fillAll('rgba(0, 0, 0, 0)');
        }
      }
    };

    // Guard against texture operations that might fail
    proto.setTexture = function(texture) {
      try {
        if (!texture) {
          // Create dummy texture if none provided
          const dummy = new Bitmap(1, 1);
          dummy.fillAll('rgba(0, 0, 0, 0)');
          this.bitmap = dummy;
          return;
        }
        
        // Check if texture is a Bitmap
        if (texture instanceof Bitmap) {
          this.bitmap = texture;
        } else if (texture && texture._canvas) {
          this.bitmap = texture;
        } else {
          // Invalid texture, use dummy
          const dummy = new Bitmap(1, 1);
          dummy.fillAll('rgba(0, 0, 0, 0)');
          this.bitmap = dummy;
        }
      } catch (e) {
        console.warn(`[${PLUGIN_NAME}] Error in setTexture:`, e);
        const dummy = new Bitmap(1, 1);
        dummy.fillAll('rgba(0, 0, 0, 0)');
        this.bitmap = dummy;
      }
    };

    // Intercept _calculateBounds to prevent null.trim() error
    if (proto._calculateBounds) {
      const _orig_calculateBounds = proto._calculateBounds;
      proto._calculateBounds = function() {
        try {
          return _orig_calculateBounds.call(this);
        } catch (e) {
          const errMsg = String(e);
          if (errMsg.includes('trim') || errMsg.includes('null')) {
            console.warn(`[${PLUGIN_NAME}] Caught texture null error, using fallback:`, e);
            
            // Ensure bitmap is valid
            if (!this.bitmap) {
              this.bitmap = new Bitmap(1, 1);
              this.bitmap.fillAll('rgba(0, 0, 0, 0)');
            }
            
            // Set minimal bounds
            if (!this._bounds) {
              this._bounds = new PIXI.Rectangle(0, 0, 1, 1);
            }
            return this._bounds;
          }
          throw e;
        }
      };
    }

    // Hook ImageManager to ensure proper load
    const _orig_loadBitmap = ImageManager.loadBitmap;
    ImageManager.loadBitmap = function(path, filename) {
      const result = _orig_loadBitmap.call(this, path, filename);
      
      // Add error callback to prevent null bitmaps
      if (result && typeof result.addLoadListener === 'function') {
        result.addLoadListener(() => {
          if (!result._image && !result._canvas) {
            // Image failed to load, fill with dummy
            result._canvas = document.createElement('canvas');
            result._canvas.width = 1;
            result._canvas.height = 1;
            const ctx = result._canvas.getContext('2d');
            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.fillRect(0, 0, 1, 1);
          }
        });
      }
      
      return result;
    };

    console.log(`[${PLUGIN_NAME}] Successfully patched Sprite_Corridor3D`);
  };

  // Start patching when scene is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForSprite);
  } else {
    waitForSprite();
  }
})();
