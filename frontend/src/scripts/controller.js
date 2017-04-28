/**
 * Scrumbot Sift. Frontend controller entry point.
 */
import { SiftController, registerSiftController } from '@redsift/sift-sdk-web';

export default class MyController extends SiftController {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();
  }

  // for more info: http://docs.redsift.com/docs/client-code-siftcontroller
  loadView(state) {
    console.log('scrumbot: loadView', state);
    switch (state.type) {
      case 'summary':
        return { html: 'summary.html', data: {}};
      default:
        console.error('scrumbot: unknown Sift type: ', state.type);
    }
  }

}

// Do not remove. The Sift is responsible for registering its views and controllers
registerSiftController(new MyController());
