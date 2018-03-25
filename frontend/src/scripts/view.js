/**
 * Hello Sift Sift. Frontend view entry point.
 */
import { SiftView, registerSiftView } from '@redsift/sift-sdk-web';

export default class MyView extends SiftView {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();

    this.controller.subscribe('settings', this._onSettings.bind(this));
    this.controller.subscribe('slackInfo', this._onSlackInfo.bind(this));

    window.addEventListener('load', this.formHandler.bind(this));
    this._showSlackAuthUI = this._showSlackAuthUI.bind(this);

    this._slackInfo = false;
    this._settings = null;
  }

  // for more info: http://docs.redsift.com/docs/client-code-siftview
  presentView(value) {
    console.log('scrumbot-sift: presentView: ', value);

    const { data: { slackInfo, settings } } = value;

    this._slackInfo = slackInfo;
    this._settings = settings;

    this.setupUI({ slackInfo, settings });
  }

  formHandler() {
    let that = this;
    document
      .querySelector('#settings-form')
      .addEventListener('submit', function(e) {
        e.preventDefault();

        let form = document.forms[0];
        let start = form['start-of-day'].value;
        let call = form['meeting-call'].value;
        if (parseInt(call) < parseInt(start)) {
          alert('Meeting call time must be the same as or after start of day');
        } else {
          that.publish('wpm', {
            tz: form.tz.value,
            startOfDay: start,
            meetingCall: call,
          });
        }
      });
  }

  willPresentView(value) {
    console.log('scrumbot: willPresentView: ', value);
  }

  setupUI({ slackInfo, settings }) {
    console.log('scrumbot: setupUI: ', slackInfo, settings);

    if (slackInfo && settings) {
      $('select[name=tz]').val(settings.tz);
      $('.selectpicker').selectpicker('refresh');
      $('select[name=start-of-day]').val(settings.startOfDay);
      $('.selectpicker').selectpicker('refresh');
      $('select[name=meeting-call').val(settings.meetingCall);
      $('.selectpicker').selectpicker('refresh');

      $('#configured').css('display', 'block');
      $('#notConfigured').css('display', 'none');
    } else {
      document.querySelector('#signupBtn').addEventListener('click', e => {
        this.showOAuthPopup({ provider: 'slack' });
      });

      $('#configured').css('display', 'none');
      $('#notConfigured').css('display', 'flex');
    }
  }

  _onSettings(settings) {
    console.log('scrumbot: _onSettings view: ', settings);

    this._settings = settings;

    this.setupUI({ slackInfo: this._slackInfo, settings });
  }

  _onSlackInfo(slackInfo) {
    console.log('scrumbot: _onSlackInfo view: ', slackInfo);

    this._slackInfo = slackInfo;

    this.setupUI({ slackInfo, settings: this._settings });
  }
}

registerSiftView(new MyView(window));
