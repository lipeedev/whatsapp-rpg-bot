import { UniversalCache } from 'youtubei.js';
import { Innertube, Platform, Types } from 'youtubei.js/web';

Platform.shim.eval = async (data: Types.BuildScriptResult) => {
  return new Function(data.output)();;
};

export const yt = await Innertube.create({
  cache: new UniversalCache(false),
  generate_session_locally: true,
});

