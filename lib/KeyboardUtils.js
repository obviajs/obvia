KeyboardUtils = {};
KeyboardUtils.test = {};
KeyboardUtils.test["CTR+Z"] = (e) => { return ((e.keyCode == 90 || e.keyCode == 122) && ((Env.getInstance().current == EnvType.MAC && e.metaKey && !e.shiftKey) || e.ctrlKey)); };
KeyboardUtils.test["CTR+Y"] = (e) => { return (((e.keyCode == 89 || e.keyCode == 121) && e.ctrlKey) || ((Env.getInstance().current == EnvType.MAC && e.metaKey && e.shiftKey) && (e.keyCode == 90 || e.keyCode == 122)));};