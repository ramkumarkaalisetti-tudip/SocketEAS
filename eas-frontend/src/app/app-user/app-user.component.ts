import { Socket } from 'ng-socket-io';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-app-user',
  templateUrl: './app-user.component.html',
  styleUrls: ['./app-user.component.css']
})
export class AppUserComponent implements OnInit {
  currentUrl = '';
  route = '';
  url_arr = [];
  message;
  clientInfo;
  audioUrl;
  showAlert: boolean = false;
  @ViewChild('alert') alert: ElementRef;

  constructor(private socket: Socket, router: Router, location: Location) {
    this.currentUrl = window.location.pathname;
    this.currentUrl = this.currentUrl.replace('/', '');
    this.url_arr = this.currentUrl.split('/');
    socket.emit('create room', this.url_arr);
    let that = this;
    socket.on('joined', function(data) {
      that.clientInfo = data;
      console.log(that.clientInfo);
    })
    socket.on('new notification', function (data , audio) {
      alert(data.msg_name);
    });
    socket.on('new notification by FIPS', function (data, audioUrl) {
      that.message = data.msg_name;
      that.audioUrl = audioUrl;
      that.showAlert = true;
      alert(data.msg_name);
      window.setTimeout(function() {
        that.showAlert = false;
      }, 10000);
    });
    socket.on('send to FIPS', function (data) {
      alert(data.msg_name);
    });
  }
  ngOnInit() {
  }

  closeAlert() {
    this.alert.nativeElement.classList.remove('show');
    this.showAlert = false;
  }
}
