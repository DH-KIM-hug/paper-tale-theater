// Workers 진입점: 핸들러 말고 다른 이름의 내보내기가 있으면 런타임이 시작하지 못하므로 default 하나만 둔다.
import { handle } from './app.js';

export default {
  fetch: (request, env) => handle(request, env),
};
