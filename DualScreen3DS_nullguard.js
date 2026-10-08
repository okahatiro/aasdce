/*:
 * @plugindesc DualScreen3DS null-guard for stage battle transitions
 * @author GitHub Copilot
 * @help
 * Prevents Pixi.js "Cannot read property 'trim' of null" when a stage battle
 * advances to the next enemy and the enemy has no custom image set.
 *
 * Place this plugin below DualScreen3DS.js in the Plugin Manager.
 *
 */

(() => {
  const safe = () => {
    const ctor = window.Sprite_Corridor3D;
    if (!ctor || !ctor.prototype) {
      return false;
    }
    if (ctor.prototype._copilotNullGuard) {
      return true;
    }

    const ensureDummyTexture = sprite => {
      if (!sprite) {
        return;
      }

      if (sprite.texture && sprite.texture.trim !== undefined && sprite.texture !== null) {
        return;
      }

      if (!sprite.bitmap) {
        sprite.bitmap = new Bitmap(1, 1);
        sprite.bitmap.fillAll("rgba(0,0,0,0)");
      }

      if (sprite.texture && sprite.texture.destroy) {
        sprite.texture.destroy(true);
      }
      sprite.texture = null;
    };

    const patchBounds = () => {
      const original = ctor.prototype._calculateBounds;
      if (!original || ctor.prototype._copilotPatchedBounds) {
        return;
      }

      ctor.prototype._calculateBounds = function() {
        try {
          return original.apply(this, arguments);
        } catch (e) {
          const msg = e && (e.message || String(e));
          if (msg && msg.includes("trim")) {
            ensureDummyTexture(this);
            if (this._renderWidth === undefined) {
              this._renderWidth = 0;
            }
            if (this._renderHeight === undefined) {
              this._renderHeight = 0;
            }
            return;
          }
          throw e;
        }
      };

      ctor.prototype._copilotPatchedBounds = true;
    };

    const patchSetter = () => {
      const target = ctor.prototype.setBitmap || ctor.prototype.setTexture || ctor.prototype.setCorridorBitmap;
      if (!target || ctor.prototype._copilotPatchedSetter) {
        return;
      }

      ctor.prototype.setBitmap = function(bitmap) {
        if (!bitmap) {
          const dummy = new Bitmap(1, 1);
          dummy.fillAll("rgba(0,0,0,0)");
          return target.call(this, dummy);
        }
        return target.call(this, bitmap);
      };

      ctor.prototype._copilotPatchedSetter = true;
    };

    patchBounds();
    patchSetter();
    ctor.prototype._copilotNullGuard = true;
    return true;
  };

  const retry = () => {
    if (!safe()) {
      setTimeout(retry, 50);
    }
  };

  setTimeout(retry, 0);
})();
