// import {async, ComponentFixture, TestBed} from '@angular/core/testing';
// import {CoursesCardListComponent} from './courses-card-list.component';
// import {CoursesModule} from '../courses.module';
// import {COURSES} from '../../../../server/db-data';
// import {DebugElement} from '@angular/core';
// import {By} from '@angular/platform-browser';
// import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
// import {Course} from '../model/course';
// import {setupCourses} from '../common/setup-test-data';

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { CoursesCardListComponent } from "./courses-card-list.component";
import { setupCourses } from "../common/setup-test-data";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

describe('CoursesCardListComponent', () => {
    let component: CoursesCardListComponent;
    let fixture: ComponentFixture<CoursesCardListComponent>;
    let el:DebugElement;

    // waitForAsync() is a function for test. without this, tests will execute before .then()'s response

    beforeEach(waitForAsync( () => {
        TestBed.configureTestingModule({
            // imports every components you need to test here
            imports: [CoursesModule]
        })
            .compileComponents()
            .then(() => {

                fixture = TestBed.createComponent(CoursesCardListComponent);
                component = fixture.componentInstance;
                el = fixture.debugElement;
            });
    }));


  it("should create the component", () => {
    expect(component).toBeTruthy();

    // console.log(component);

  });


  it("should display the course list", () => {

    // better to prepare courses data for tests
    component.courses = setupCourses();

    // this is not async environment so you need this
    fixture.detectChanges();

    // check the native dom element
    // console.log("NATIVE", el.nativeElement)

    const cards = el.queryAll(By.css(".course-card"));

    expect(cards).toBeTruthy("Could not find cards");
    expect(cards.length).toBe(12, "Unexpected number of courses");

  });


  it("should display the first course", () => {

      component.courses = setupCourses();
      fixture.detectChanges();

      const course = component.courses[0];
      const card = el.query(By.css(".course-card:first-child"));
      const title = el.query(By.css("mat-card-title"));
      const image = el.query(By.css("img"));


      expect(card).toBeTruthy("could not find a course card");
      expect(title).toBeTruthy("could not find a course title");
      expect(image.nativeElement.src).toBe(course.iconUrl);

  });


});