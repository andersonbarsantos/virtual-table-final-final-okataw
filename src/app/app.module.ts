import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ScrollingModule } from './scrolling/scrolling-module';
import { MatIconModule, MatButtonModule, MatSortModule, MatProgressBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { GridModule } from './grid';

@NgModule({
  imports:      [ BrowserModule, MatProgressBarModule, BrowserAnimationsModule, ScrollingModule, GridModule, MatIconModule, MatButtonModule, MatSortModule, FlexLayoutModule],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
