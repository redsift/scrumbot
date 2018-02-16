/**
 * Scrumbot Sift. Frontend controller entry point.
 */
import { SiftController, registerSiftController } from '@redsift/sift-sdk-web';

//import Webhook from './lib/webhook';

function _sendWebhook(url, key, value) {
  // console.log('sched-sift: _sendWebhook: ', url, key, value);
  var wh = new XMLHttpRequest();
  var whurl = url;
  whurl = whurl.replace('{key}', encodeURIComponent(key));
  whurl = whurl.replace('{value}', encodeURIComponent(value));
  // console.log('sched-sift: _sendWebhook: sending: ', whurl);
  wh.open('GET', whurl, false);
  wh.send();
}

export default class MyController extends SiftController {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();
    this._suHandler = this.onStorageUpdate.bind(this);
    this.view.subscribe('wpm', this.onFormSubmit.bind(this));
  }

  // for more info: http://docs.redsift.com/docs/client-code-siftcontroller
  loadView(state) {
    console.log('scrumbot: loadView', state);
    // Register for storage update events on the "x" bucket so we can update the UI
    this.storage.subscribe(['slack_info', 'settingsExport'], this._suHandler);
    switch (state.type) {
      case 'summary':
        const wh = this.getWebhook();
        const settings = this.getSettings();
        const slackInfo = this.getSlackInfo();

        return {
          html: 'summary.html',
          data: Promise.all([wh, settings, slackInfo]).then(values => {
            return {
              webhookUri: values[0],
              settings: values[1],
              slackInfo: values[2],
            };
          }),
        };

      default:
        console.error('scrumbot: unknown Sift type: ', state.type);
    }
  }

  // Event: storage update
  onStorageUpdate(value) {
    console.log('scrumbot: onStorageUpdate: ', value);

    return this.getSettings().then(settings => {
      console.log('onStorageUpdate: settings: ', settings);
      this.publish('settings', settings);
    });

    return this.getSlackInfo().then(slackInfo => {
      console.log('onStorageUpdate: slackInfo:', slackInfo);
      this.publish('slackInfo', slackInfo);
    });
  }

  onFormSubmit(value) {
    console.log('scrumbot: FormSubmit: ', value);
    this.storage
      .get({
        bucket: '_redsift',
        keys: ['webhooks/settingsHook'],
      })
      .then(wbr => {
        console.log('scrumbot: FormSubmit webhook url: ', wbr[0].value);
        _sendWebhook(wbr[0].value, 'settings', JSON.stringify(value));
      })
      .catch(error => {
        console.error('scrumbot: FormSubmit: ', error);
      });
  }

  getWebhook() {
    return this.storage
      .get({
        bucket: '_redsift',
        keys: ['webhooks/settingsHook'],
      })
      .then(d => {
        return d[0].value;
      });
  }

  getSettings() {
    return this.storage
      .get({
        bucket: 'settingsExport',
        keys: ['settings'],
      })
      .then(values => {
        console.log('scrumbot: getSettings returned:', values[0].value);
        return values[0].value ? JSON.parse(values[0].value) : null;
      });
  }

  getSlackInfo() {
    return this.storage
      .get({
        bucket: 'slack_info',
        keys: ['slack-signed-up'],
      })
      .then(values => {
        console.log('scrumbot: getSlackInfo returned:', values[0].value);
        return values[0].value ? JSON.parse(values[0].value) : null;
      });
  }
}

// Do not remove. The Sift is responsible for registering its views and controllers
registerSiftController(new MyController());
