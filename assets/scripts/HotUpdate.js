cc.Class({
    extends: cc.Component,

    properties: {
        updatePanel: {
            default: null,
            type: cc.Node
        },
        manifestUrl: {
            default: null,
            url: cc.RawAsset
        },
        percent: {
            default: null,
            type: cc.Label
        },
        lblErr: {
            default: null,
            type: cc.Label
        },
        lblversion: cc.Label,
        fileProgress: cc.ProgressBar,
    },

    checkCb: function (event) {
        cc.log('Code: ' + event.getEventCode());
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log("No local manifest file found, hot update skipped.");
                cc.eventManager.removeListener(this._checkListener);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log("Fail to download manifest file, hot update skipped.");
                cc.eventManager.removeListener(this._checkListener);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log("Already up to date with the latest remote version.");
                cc.eventManager.removeListener(this._checkListener);
                // this.lblErr.string += "游戏不需要更新\n";
                cc.director.loadScene("loading");
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this._needUpdate = true;
                this.updatePanel.active = true;
                this.percent.string = '0%';
                cc.eventManager.removeListener(this._checkListener);
                this.fileProgress.node.active = true;
                this.fileProgress.progress = 0;
                break;
            default:
                break;
        }
        this.hotUpdate();
    },

    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log('No local manifest file found, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                var percent = event.getPercent();
                var percentByFile = event.getPercentByFile();

                cc.log("percent = ", percent.toFixed(0) + '%');
                cc.log("percentByFile = ", percentByFile.toFixed(0) + '%');

                var msg = event.getMessage();
                if (msg) {
                    cc.log("file update", msg);
                    this._updateFile = true;
                }

                var updatePercent = 0;
                if (this._updateFile == false) {
                    updatePercent = percent.toFixed(0);
                }else {
                    updatePercent = percentByFile.toFixed(0);
                }

                this.lblErr.string = ""
                this.percent.string = updatePercent + '%';
                this.fileProgress.progress = updatePercent / 100;
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log('Fail to download manifest file, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log('Already up to date with the latest remote version.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                cc.log('Update finished. ' + event.getMessage());

                needRestart = true;
                this._updateFile = false;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                cc.log('Update failed. ' + event.getMessage());

                this._failCount ++;
                if (this._failCount < 5)
                {
                    this._am.downloadFailedAssets();
                }
                else
                {
                    cc.log('Reach maximum fail count, exit update process');
                    this._failCount = 0;
                    failed = true;
                }
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                cc.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                cc.log(event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            cc.eventManager.removeListener(this._updateListener);
            this.updatePanel.active = false;
        }

        if (needRestart) {
            cc.eventManager.removeListener(this._updateListener);
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            Array.prototype.unshift(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));

            jsb.fileUtils.setSearchPaths(searchPaths);
            this.lblErr.string += "游戏资源更新完毕\n";
            cc.game.restart();
        }
    },

    hotUpdate: function () {
        if (this._am && this._needUpdate) {
            this.lblErr.string += "开始更新游戏资源...\n";
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);

            this._failCount = 0;
            this._am.update();
        }
    },

    // use this for initialization
    onLoad: function () {
        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            cc.director.loadScene("loading");
            return;
        }
        this.lblErr.string += "检查游戏资源...\n";
        var storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'guoyaoqipai-asset');
        cc.log('Storage path for remote asset : ' + storagePath);
        var storagePathTip = "资源检查更新中...";
        this.lblErr.string = storagePathTip + "\n";
        cc.log('Local manifest URL : ' + this.manifestUrl);
        this._am = new jsb.AssetsManager(this.manifestUrl, storagePath);
        this._am.retain();

        var self = this
        this._am.setVersionCompareHandle(function (versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            self.lblversion.string = "Ver:" + versionB
            cc.mjVersion = "Ver:" + versionB.toString().substr(0,3)
            cc.log("Version :", cc.mjVersion);

            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        });

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(1);
        }

        this._needUpdate = false;
        this._updateFile = false;
        if (this._am.getLocalManifest().isLoaded())
        {
            this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
            cc.eventManager.addListener(this._checkListener, 1);

            this._am.checkUpdate();
        }

        this.fileProgress.node.active = false;
        this.fileProgress.progress = 0;
    },

    onDestroy: function () {
        this._am && this._am.release();
    }
});
