/**
 * Hello Sift Sift. Frontend view entry point.
 */
import {
  SiftView,
  registerSiftView
} from '@redsift/sift-sdk-web';

export default class MyView extends SiftView {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();
    this.controller.subscribe('settings', this.onSettings.bind(this));
    window.addEventListener('load', this.formHandler.bind(this))

  }


  // for more info: http://docs.redsift.com/docs/client-code-siftview
  presentView(value) {
    console.log('scrumbot-sift: presentView: ', value.data.settings.tz);
    $('select[name=tz]').val(value.data.settings.tz);
    $('.selectpicker').selectpicker('refresh')
    $('select[name=start-of-day]').val(value.data.settings.startOfDay);
    $('.selectpicker').selectpicker('refresh')
    $('select[name=meeting-call').val(value.data.settings.meetingCall);
    $('.selectpicker').selectpicker('refresh');
    //document.getElementById("tz1").val = value.data.settings.tz;
    //document.getElementById("tz1").selectpicker('refresh') ;
    //document.getElementById("settings-form").action = value.data.hook_uri;
    // document.getElementById("settings-form").addEventListener("submit", function(e){
    //   console.log("SUBMIT ", e, this);
    //   this.publish('wpm', e.target.value);
    // })

  };

  formHandler() {
    let that = this;
    document.getElementById("settings-form").addEventListener("submit", function(e) {
      console.log("SUBMIT ", e);
      e.preventDefault()
      let form = document.forms[0];

      // console.log("FORM STUFF ", form.tz.value);
      that.publish('wpm', {
        tz: form.tz.value,
        startOfDay: form['start-of-day'].value,
        meetingCall: form['meeting-call'].value
      });
    })
  };

  willPresentView(value) {
    console.log('hello-sift: willPresentView: ', value);

  };

  onSettings(data) {
    let settings = data;
    console.log('scrumbot: onSettings view: ', settings);
    $('select[name=tz]').val(settings.tz);
    $('.selectpicker').selectpicker('refresh')
    $('select[name=start-of-day]').val(parseInt(settings.startOfDay));
    $('.selectpicker').selectpicker('refresh')
    $('select[name=meeting-call').val(parseInt(settings.meetingCall));
    $('.selectpicker').selectpicker('refresh');
  }

}

registerSiftView(new MyView(window));
