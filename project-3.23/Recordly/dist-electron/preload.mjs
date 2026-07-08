"use strict";
const electron = require("electron");
const nativeVideoExportWriteRequests = /* @__PURE__ */ new Map();
let nextNativeVideoExportWriteRequestId = 1;
let nativeVideoExportWriteResultListenerAttached = false;
function ensureNativeVideoExportWriteResultListener() {
  if (nativeVideoExportWriteResultListenerAttached) {
    return;
  }
  nativeVideoExportWriteResultListenerAttached = true;
  electron.ipcRenderer.on(
    "native-video-export-write-frame-result",
    (_event, payload) => {
      if (typeof (payload == null ? void 0 : payload.requestId) !== "number") {
        return;
      }
      const pendingRequest = nativeVideoExportWriteRequests.get(payload.requestId);
      if (!pendingRequest) {
        return;
      }
      nativeVideoExportWriteRequests.delete(payload.requestId);
      pendingRequest.resolve({
        success: payload.success === true,
        error: payload.error
      });
    }
  );
}
function settleNativeVideoExportPendingRequests(sessionId, result) {
  for (const [requestId, pendingRequest] of nativeVideoExportWriteRequests.entries()) {
    if (pendingRequest.sessionId !== sessionId) {
      continue;
    }
    nativeVideoExportWriteRequests.delete(requestId);
    pendingRequest.resolve(result);
  }
}
electron.contextBridge.exposeInMainWorld("electronAPI", {
  hudOverlaySetIgnoreMouse: (ignore) => {
    electron.ipcRenderer.send("hud-overlay-set-ignore-mouse", ignore);
  },
  hudOverlayDrag: (phase, screenX, screenY) => {
    electron.ipcRenderer.send("hud-overlay-drag", phase, screenX, screenY);
  },
  hudOverlayHide: () => {
    electron.ipcRenderer.send("hud-overlay-hide");
  },
  hudOverlayClose: () => {
    electron.ipcRenderer.send("hud-overlay-close");
  },
  setHudOverlayExpanded: (expanded) => {
    electron.ipcRenderer.send("set-hud-overlay-expanded", expanded);
  },
  setHudOverlayCompactWidth: (width) => {
    electron.ipcRenderer.send("set-hud-overlay-compact-width", width);
  },
  setHudOverlayMeasuredHeight: (height, expanded) => {
    electron.ipcRenderer.send("set-hud-overlay-measured-height", height, expanded);
  },
  getHudOverlayCaptureProtection: () => {
    return electron.ipcRenderer.invoke("get-hud-overlay-capture-protection");
  },
  getHudOverlayMousePassthroughSupported: () => {
    return electron.ipcRenderer.invoke("get-hud-overlay-mouse-passthrough-supported");
  },
  setHudOverlayCaptureProtection: (enabled) => {
    return electron.ipcRenderer.invoke("set-hud-overlay-capture-protection", enabled);
  },
  getAssetBasePath: async () => {
    return await electron.ipcRenderer.invoke("get-asset-base-path");
  },
  listAssetDirectory: (relativeDir) => {
    return electron.ipcRenderer.invoke("list-asset-directory", relativeDir);
  },
  readLocalFile: (filePath) => {
    return electron.ipcRenderer.invoke("read-local-file", filePath);
  },
  generateWallpaperThumbnail: (filePath) => {
    return electron.ipcRenderer.invoke("generate-wallpaper-thumbnail", filePath);
  },
  nativeVideoExportStart: (options) => {
    return electron.ipcRenderer.invoke("native-video-export-start", options);
  },
  nativeVideoExportWriteFrame: (sessionId, frameData) => {
    ensureNativeVideoExportWriteResultListener();
    return new Promise((resolve) => {
      const requestId = nextNativeVideoExportWriteRequestId++;
      nativeVideoExportWriteRequests.set(requestId, {
        sessionId,
        resolve
      });
      electron.ipcRenderer.send("native-video-export-write-frame-async", {
        sessionId,
        requestId,
        frameData
      });
    });
  },
  nativeVideoExportFinish: (sessionId, options) => {
    return electron.ipcRenderer.invoke("native-video-export-finish", sessionId, options).then((result) => {
      settleNativeVideoExportPendingRequests(
        sessionId,
        (result == null ? void 0 : result.success) ? { success: true } : {
          success: false,
          error: typeof (result == null ? void 0 : result.error) === "string" ? result.error : "Native video export session finished before all frame writes settled."
        }
      );
      return result;
    });
  },
  nativeVideoExportCancel: (sessionId) => {
    return electron.ipcRenderer.invoke("native-video-export-cancel", sessionId).finally(() => {
      settleNativeVideoExportPendingRequests(sessionId, {
        success: false,
        error: "Native video export session was cancelled"
      });
    });
  },
  muxExportedVideoAudio: (videoData, options) => {
    return electron.ipcRenderer.invoke("mux-exported-video-audio", videoData, options);
  },
  muxExportedVideoAudioFromPath: (videoPath, options) => {
    return electron.ipcRenderer.invoke("mux-exported-video-audio-from-path", videoPath, options);
  },
  openExportStream: (options) => {
    return electron.ipcRenderer.invoke("export-stream-open", options);
  },
  writeExportStreamChunk: (streamId, position, chunk) => {
    return electron.ipcRenderer.invoke("export-stream-write", streamId, position, chunk);
  },
  closeExportStream: (streamId, options) => {
    return electron.ipcRenderer.invoke("export-stream-close", streamId, options);
  },
  finalizeExportedVideo: (payload) => {
    return electron.ipcRenderer.invoke("finalize-exported-video", payload);
  },
  discardExportedTemp: (tempPath) => {
    return electron.ipcRenderer.invoke("discard-exported-temp", tempPath);
  },
  getVideoAudioFallbackPaths: (videoPath) => {
    return electron.ipcRenderer.invoke("get-video-audio-fallback-paths", videoPath);
  },
  getSources: async (opts) => {
    return await electron.ipcRenderer.invoke("get-sources", opts);
  },
  switchToEditor: () => {
    return electron.ipcRenderer.invoke("switch-to-editor");
  },
  openSourceSelector: () => {
    return electron.ipcRenderer.invoke("open-source-selector");
  },
  selectSource: (source) => {
    return electron.ipcRenderer.invoke("select-source", source);
  },
  showSourceHighlight: (source) => {
    return electron.ipcRenderer.invoke("show-source-highlight", source);
  },
  getSelectedSource: () => {
    return electron.ipcRenderer.invoke("get-selected-source");
  },
  onSelectedSourceChanged: (callback) => {
    const listener = (_event, payload) => callback(payload);
    electron.ipcRenderer.on("selected-source-changed", listener);
    return () => electron.ipcRenderer.removeListener("selected-source-changed", listener);
  },
  startNativeScreenRecording: (source, options) => {
    return electron.ipcRenderer.invoke("start-native-screen-recording", source, options);
  },
  stopNativeScreenRecording: () => {
    return electron.ipcRenderer.invoke("stop-native-screen-recording");
  },
  recoverNativeScreenRecording: () => {
    return electron.ipcRenderer.invoke("recover-native-screen-recording");
  },
  getLastNativeCaptureDiagnostics: () => {
    return electron.ipcRenderer.invoke("get-last-native-capture-diagnostics");
  },
  pauseNativeScreenRecording: () => {
    return electron.ipcRenderer.invoke("pause-native-screen-recording");
  },
  resumeNativeScreenRecording: () => {
    return electron.ipcRenderer.invoke("resume-native-screen-recording");
  },
  pauseCursorCapture: () => {
    return electron.ipcRenderer.invoke("pause-cursor-capture");
  },
  resumeCursorCapture: () => {
    return electron.ipcRenderer.invoke("resume-cursor-capture");
  },
  startFfmpegRecording: (source) => {
    return electron.ipcRenderer.invoke("start-ffmpeg-recording", source);
  },
  stopFfmpegRecording: () => {
    return electron.ipcRenderer.invoke("stop-ffmpeg-recording");
  },
  storeRecordedVideo: (videoData, fileName) => {
    return electron.ipcRenderer.invoke("store-recorded-video", videoData, fileName);
  },
  storeMicrophoneSidecar: (audioData, videoPath, options) => {
    return electron.ipcRenderer.invoke("store-microphone-sidecar", audioData, videoPath, options);
  },
  getRecordedVideoPath: () => {
    return electron.ipcRenderer.invoke("get-recorded-video-path");
  },
  setRecordingState: (recording) => {
    return electron.ipcRenderer.invoke("set-recording-state", recording);
  },
  setCursorScale: (scale) => {
    return electron.ipcRenderer.invoke("set-cursor-scale", scale);
  },
  getCursorTelemetry: (videoPath) => {
    return electron.ipcRenderer.invoke("get-cursor-telemetry", videoPath);
  },
  setCursorTelemetry: (videoPath, samples) => {
    return electron.ipcRenderer.invoke("set-cursor-telemetry", videoPath, samples);
  },
  getSystemCursorAssets: () => {
    return electron.ipcRenderer.invoke("get-system-cursor-assets");
  },
  onStopRecordingFromTray: (callback) => {
    const listener = () => callback();
    electron.ipcRenderer.on("stop-recording-from-tray", listener);
    return () => electron.ipcRenderer.removeListener("stop-recording-from-tray", listener);
  },
  onRecordingStateChanged: (callback) => {
    const listener = (_event, payload) => callback(payload);
    electron.ipcRenderer.on("recording-state-changed", listener);
    return () => electron.ipcRenderer.removeListener("recording-state-changed", listener);
  },
  onRecordingInterrupted: (callback) => {
    const listener = (_event, payload) => callback(payload);
    electron.ipcRenderer.on("recording-interrupted", listener);
    return () => electron.ipcRenderer.removeListener("recording-interrupted", listener);
  },
  onCursorStateChanged: (callback) => {
    const listener = (_event, payload) => callback(payload);
    electron.ipcRenderer.on("cursor-state-changed", listener);
    return () => electron.ipcRenderer.removeListener("cursor-state-changed", listener);
  },
  openExternalUrl: (url) => {
    return electron.ipcRenderer.invoke("open-external-url", url);
  },
  getAccessibilityPermissionStatus: () => {
    return electron.ipcRenderer.invoke("get-accessibility-permission-status");
  },
  requestAccessibilityPermission: () => {
    return electron.ipcRenderer.invoke("request-accessibility-permission");
  },
  getScreenRecordingPermissionStatus: () => {
    return electron.ipcRenderer.invoke("get-screen-recording-permission-status");
  },
  openScreenRecordingPreferences: () => {
    return electron.ipcRenderer.invoke("open-screen-recording-preferences");
  },
  openAccessibilityPreferences: () => {
    return electron.ipcRenderer.invoke("open-accessibility-preferences");
  },
  saveExportedVideo: (videoData, fileName) => {
    return electron.ipcRenderer.invoke("save-exported-video", videoData, fileName);
  },
  writeExportedVideoToPath: (videoData, outputPath) => {
    return electron.ipcRenderer.invoke("write-exported-video-to-path", videoData, outputPath);
  },
  openVideoFilePicker: () => {
    return electron.ipcRenderer.invoke("open-video-file-picker");
  },
  openAudioFilePicker: () => {
    return electron.ipcRenderer.invoke("open-audio-file-picker");
  },
  openWhisperExecutablePicker: () => {
    return electron.ipcRenderer.invoke("open-whisper-executable-picker");
  },
  openWhisperModelPicker: () => {
    return electron.ipcRenderer.invoke("open-whisper-model-picker");
  },
  getWhisperSmallModelStatus: () => {
    return electron.ipcRenderer.invoke("get-whisper-small-model-status");
  },
  downloadWhisperSmallModel: () => {
    return electron.ipcRenderer.invoke("download-whisper-small-model");
  },
  deleteWhisperSmallModel: () => {
    return electron.ipcRenderer.invoke("delete-whisper-small-model");
  },
  onWhisperSmallModelDownloadProgress: (callback) => {
    const listener = (_event, payload) => callback(payload);
    electron.ipcRenderer.on("whisper-small-model-download-progress", listener);
    return () => electron.ipcRenderer.removeListener("whisper-small-model-download-progress", listener);
  },
  generateAutoCaptions: (options) => {
    return electron.ipcRenderer.invoke("generate-auto-captions", options);
  },
  setCurrentVideoPath: (path, options) => {
    return electron.ipcRenderer.invoke("set-current-video-path", path, options);
  },
  setCurrentRecordingSession: (session, options) => {
    return electron.ipcRenderer.invoke("set-current-recording-session", session, options);
  },
  getCurrentRecordingSession: () => {
    return electron.ipcRenderer.invoke("get-current-recording-session");
  },
  getCurrentVideoPath: () => {
    return electron.ipcRenderer.invoke("get-current-video-path");
  },
  clearCurrentVideoPath: () => {
    return electron.ipcRenderer.invoke("clear-current-video-path");
  },
  deleteRecordingFile: (filePath) => {
    return electron.ipcRenderer.invoke("delete-recording-file", filePath);
  },
  getLocalMediaUrl: (filePath) => {
    return electron.ipcRenderer.invoke("get-local-media-url", filePath);
  },
  saveProjectFile: (projectData, suggestedName, existingProjectPath, thumbnailDataUrl) => {
    return electron.ipcRenderer.invoke(
      "save-project-file",
      projectData,
      suggestedName,
      existingProjectPath,
      thumbnailDataUrl
    );
  },
  saveProjectFileNamed: (projectData, projectName, thumbnailDataUrl) => {
    return electron.ipcRenderer.invoke(
      "save-project-file-named",
      projectData,
      projectName,
      thumbnailDataUrl
    );
  },
  loadProjectFile: () => {
    return electron.ipcRenderer.invoke("load-project-file");
  },
  loadCurrentProjectFile: () => {
    return electron.ipcRenderer.invoke("load-current-project-file");
  },
  getProjectsDirectory: () => {
    return electron.ipcRenderer.invoke("get-projects-directory");
  },
  listProjectFiles: () => {
    return electron.ipcRenderer.invoke("list-project-files");
  },
  openProjectFileAtPath: (filePath) => {
    return electron.ipcRenderer.invoke("open-project-file-at-path", filePath);
  },
  openProjectsDirectory: () => {
    return electron.ipcRenderer.invoke("open-projects-directory");
  },
  installDownloadedUpdate: () => {
    return electron.ipcRenderer.invoke("install-downloaded-update");
  },
  downloadAvailableUpdate: (installAfterDownload) => {
    return electron.ipcRenderer.invoke("download-available-update", installAfterDownload);
  },
  deferDownloadedUpdate: (delayMs) => {
    return electron.ipcRenderer.invoke("defer-downloaded-update", delayMs);
  },
  dismissUpdateToast: () => {
    return electron.ipcRenderer.invoke("dismiss-update-toast");
  },
  skipUpdateVersion: () => {
    return electron.ipcRenderer.invoke("skip-update-version");
  },
  getCurrentUpdateToastPayload: () => {
    return electron.ipcRenderer.invoke("get-current-update-toast-payload");
  },
  getUpdateStatusSummary: () => {
    return electron.ipcRenderer.invoke("get-update-status-summary");
  },
  previewUpdateToast: () => {
    return electron.ipcRenderer.invoke("preview-update-toast");
  },
  checkForAppUpdates: () => {
    return electron.ipcRenderer.invoke("check-for-app-updates");
  },
  onUpdateToastStateChanged: (callback) => {
    const listener = (_event, payload) => callback(payload);
    electron.ipcRenderer.on("update-toast-state", listener);
    return () => electron.ipcRenderer.removeListener("update-toast-state", listener);
  },
  onUpdateReadyToast: (callback) => {
    const listener = (_event, payload) => callback(payload);
    electron.ipcRenderer.on("update-ready-toast", listener);
    return () => electron.ipcRenderer.removeListener("update-ready-toast", listener);
  },
  onMenuLoadProject: (callback) => {
    const listener = () => callback();
    electron.ipcRenderer.on("menu-load-project", listener);
    return () => electron.ipcRenderer.removeListener("menu-load-project", listener);
  },
  onMenuSaveProject: (callback) => {
    const listener = () => callback();
    electron.ipcRenderer.on("menu-save-project", listener);
    return () => electron.ipcRenderer.removeListener("menu-save-project", listener);
  },
  onMenuSaveProjectAs: (callback) => {
    const listener = () => callback();
    electron.ipcRenderer.on("menu-save-project-as", listener);
    return () => electron.ipcRenderer.removeListener("menu-save-project-as", listener);
  },
  getPlatform: () => {
    return electron.ipcRenderer.invoke("get-platform");
  },
  getLinuxWindowSystem: () => {
    return electron.ipcRenderer.invoke("get-linux-window-system");
  },
  revealInFolder: (filePath) => {
    return electron.ipcRenderer.invoke("reveal-in-folder", filePath);
  },
  openRecordingsFolder: () => {
    return electron.ipcRenderer.invoke("open-recordings-folder");
  },
  getRecordingsDirectory: () => {
    return electron.ipcRenderer.invoke("get-recordings-directory");
  },
  chooseRecordingsDirectory: () => {
    return electron.ipcRenderer.invoke("choose-recordings-directory");
  },
  getShortcuts: () => {
    return electron.ipcRenderer.invoke("get-shortcuts");
  },
  saveShortcuts: (shortcuts) => {
    return electron.ipcRenderer.invoke("save-shortcuts", shortcuts);
  },
  setHasUnsavedChanges: (hasChanges) => {
    electron.ipcRenderer.send("set-has-unsaved-changes", hasChanges);
  },
  onRequestSaveBeforeClose: (callback) => {
    const listener = async () => {
      let saved = false;
      try {
        saved = await callback();
      } catch {
        saved = false;
      }
      electron.ipcRenderer.send("save-before-close-done", saved);
    };
    electron.ipcRenderer.on("request-save-before-close", listener);
    return () => electron.ipcRenderer.removeListener("request-save-before-close", listener);
  },
  isNativeWindowsCaptureAvailable: () => electron.ipcRenderer.invoke("is-native-windows-capture-available"),
  muxNativeWindowsRecording: (pauseSegments) => electron.ipcRenderer.invoke("mux-native-windows-recording", pauseSegments),
  hideOsCursor: () => electron.ipcRenderer.invoke("hide-cursor"),
  getAppVersion: () => electron.ipcRenderer.invoke("app:getVersion"),
  getRecordingPreferences: () => electron.ipcRenderer.invoke("get-recording-preferences"),
  setRecordingPreferences: (prefs) => electron.ipcRenderer.invoke("set-recording-preferences", prefs),
  getCountdownDelay: () => electron.ipcRenderer.invoke("get-countdown-delay"),
  setCountdownDelay: (delay) => electron.ipcRenderer.invoke("set-countdown-delay", delay),
  startCountdown: (seconds) => electron.ipcRenderer.invoke("start-countdown", seconds),
  cancelCountdown: () => electron.ipcRenderer.invoke("cancel-countdown"),
  getActiveCountdown: () => electron.ipcRenderer.invoke("get-active-countdown"),
  onCountdownTick: (callback) => {
    const listener = (_event, seconds) => callback(seconds);
    electron.ipcRenderer.on("countdown-tick", listener);
    return () => electron.ipcRenderer.removeListener("countdown-tick", listener);
  },
  // ── Extensions ──────────────────────────────────────────────────────
  extensionsDiscover: () => electron.ipcRenderer.invoke("extensions:discover"),
  extensionsList: () => electron.ipcRenderer.invoke("extensions:list"),
  extensionsGet: (id) => electron.ipcRenderer.invoke("extensions:get", id),
  extensionsEnable: (id) => electron.ipcRenderer.invoke("extensions:enable", id),
  extensionsDisable: (id) => electron.ipcRenderer.invoke("extensions:disable", id),
  extensionsInstallFromFolder: () => electron.ipcRenderer.invoke("extensions:install-from-folder"),
  extensionsUninstall: (id) => electron.ipcRenderer.invoke("extensions:uninstall", id),
  extensionsGetDirectory: () => electron.ipcRenderer.invoke("extensions:get-directory"),
  extensionsOpenDirectory: () => electron.ipcRenderer.invoke("extensions:open-directory"),
  // ── Extensions — Marketplace ────────────────────────────────────────
  extensionsMarketplaceSearch: (params) => electron.ipcRenderer.invoke("extensions:marketplace-search", params),
  extensionsMarketplaceGet: (id) => electron.ipcRenderer.invoke("extensions:marketplace-get", id),
  extensionsMarketplaceInstall: (extensionId, downloadUrl) => electron.ipcRenderer.invoke("extensions:marketplace-install", extensionId, downloadUrl),
  extensionsMarketplaceSubmit: (extensionId) => electron.ipcRenderer.invoke("extensions:marketplace-submit", extensionId),
  // ── Extensions — Admin Review ───────────────────────────────────────
  extensionsReviewsList: (params) => electron.ipcRenderer.invoke("extensions:reviews-list", params),
  extensionsReviewUpdate: (reviewId, status, notes) => electron.ipcRenderer.invoke("extensions:review-update", reviewId, status, notes)
});
