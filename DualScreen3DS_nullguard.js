/*:
 * @plugindesc DualScreen3DS - Fix texture() method collision with PixiJS
 * @author GitHub Copilot
 * @help
 * Fixes the collision between Sprite_Corridor3D.texture() method and
 * PixiJS Sprite.texture property that causes "Cannot read property 'trim' of null".
 *
 * Place this plugin BELOW DualScreen3DS.js in the Plugin Manager.
 *
 */

(() => {
  const PLUGIN_NAME = 'DualScreen3DS_TextureCollisionFix';

  const waitForSprite = () => {
    if (!window.Sprite_Corridor3D || !window.Sprite_Corridor3D.prototype) {
      setTimeout(waitForSprite, 50);
      return;
    }
    fixTextureCollision();
  };

  const fixTextureCollision = () => {
    const proto = Sprite_Corridor3D.prototype;
    
    console.log(`[${PLUGIN_NAME}] Fixing texture collision...`);

    // Store the original texture() method with a different name to avoid collision
    if (typeof proto.texture === 'function') {
      proto._getCorridorTexture = proto.texture;
      delete proto.texture; // Remove the method so PixiJS texture property can work
      console.log(`[${PLUGIN_NAME}] Renamed texture() method to _getCorridorTexture()`);
    }

    // Patch initialize to ensure proper texture setup
    const _orig_initialize = proto.initialize;
    proto.initialize = function() {
      if (_orig_initialize) {
        _orig_initialize.call(this);
      }

      // Ensure texture property is set to a valid PixiJS texture
      if (!this.texture || this.texture === null || this.texture === undefined) {
        // Create a minimal valid texture
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, 1, 1);
        
        const baseTexture = new PIXI.BaseTexture(canvas);
        this.texture = new PIXI.Texture(baseTexture);
        console.log(`[${PLUGIN_NAME}] Created fallback texture in initialize()`);
      }
    };

    // Patch update to guard against texture becoming null
    const _orig_update = proto.update;
    proto.update = function() {
      try {
        // Guard: ensure texture is valid before update
        if (!this.texture || this.texture === null) {
          const canvas = document.createElement('canvas');
          canvas.width = 1;
          canvas.height = 1;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = 'rgba(0, 0, 0, 0)';
          ctx.fillRect(0, 0, 1, 1);
          
          const baseTexture = new PIXI.BaseTexture(canvas);
          this.texture = new PIXI.Texture(baseTexture);
          console.log(`[${PLUGIN_NAME}] Restored null texture in update()`);
        }

        if (_orig_update) {
          _orig_update.call(this);
        }
      } catch (e) {
        console.warn(`[${PLUGIN_NAME}] Error in update():`, e);
      }
    };

    // Intercept any method that might set texture to null
    const _orig_setBitmap = proto.setBitmap;
    if (_orig_setBitmap) {
      proto.setBitmap = function(bitmap) {
        if (_orig_setBitmap) {
          _orig_setBitmap.call(this, bitmap);
        }

        // Ensure texture is valid after bitmap change
        if (!this.texture || this.texture === null) {
          if (bitmap && bitmap._canvas) {
            const baseTexture = new PIXI.BaseTexture(bitmap._canvas);
            this.texture = new PIXI.Texture(baseTexture);
          } else {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.fillRect(0, 0, 1, 1);
            
            const baseTexture = new PIXI.BaseTexture(canvas);
            this.texture = new PIXI.Texture(baseTexture);
          }
        }
      };
    }

    // Override _calculateBounds to catch the error before it crashes
    const _orig_calculateBounds = proto._calculateBounds;
    if (_orig_calculateBounds) {
      proto._calculateBounds = function() {
        try {
          // Ensure texture is never null when calculating bounds
          if (!this.texture || this.texture === null) {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.fillRect(0, 0, 1, 1);
            
            const baseTexture = new PIXI.BaseTexture(canvas);
            this.texture = new PIXI.Texture(baseTexture);
          }

          return _orig_calculateBounds.call(this);
        } catch (e) {
          const errMsg = String(e);
          if (errMsg.includes('trim')) {
            console.warn(`[${PLUGIN_NAME}] Caught trim() error in _calculateBounds, applying fallback`);
            
            // Last resort: set PIXI.Texture.WHITE
            if (!this.texture) {
              this.texture = PIXI.Texture.WHITE;
            }
            
            // Return minimal bounds
            if (!this._bounds) {
              this._bounds = new PIXI.Rectangle(0, 0, 1, 1);
            }
            return this._bounds;
          }
          throw e;
        }
      };
    }

    console.log(`[${PLUGIN_NAME}] Successfully patched Sprite_Corridor3D`);
  };

  // Start patching when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForSprite);
  } else {
    waitForSprite();
  }
})();
