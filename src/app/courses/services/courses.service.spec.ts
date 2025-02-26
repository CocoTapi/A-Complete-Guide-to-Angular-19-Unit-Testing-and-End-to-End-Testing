import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service"
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { HttpErrorResponse, provideHttpClient } from "@angular/common/http";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";

describe("CoursesService", () => {
    let coursesService: CoursesService;
    let httpTesting: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CoursesService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        coursesService = TestBed.inject(CoursesService);
        httpTesting = TestBed.inject(HttpTestingController);
    });
    
    it ('should retrieve all courses', () => {

        coursesService.findAllCourses().subscribe(courses => {
                // should not return null or undefined
                expect(courses).toBeTruthy("No courses returned");

                expect(courses.length).toBe(12, "incorrect number of courses");

                const lastCourse = courses.find(course => course.id === 12);

                expect(lastCourse.titles.description).toBe("Angular Testing Course");
        });

        // method check
        const req = httpTesting.expectOne('/api/courses');
        expect(req.request.method).toEqual("GET");

        // specify which test data should the mock http client return whenever we call the url
        // open the backend server and check the returned data structure and your 
        req.flush({
            payload: Object.values(COURSES)
        });

        // make sure no other http requests are being made accidentally. 
        // httpTesting.verify();

    })

    it ('should find a course by id', () => {

        coursesService.findCourseById(12).subscribe(course => {
                // should not return null or undefined
                expect(course).toBeTruthy("No courses returned");
                expect(course.id).toBe(12);
        });

        // method check
        const req = httpTesting.expectOne('/api/courses/12');
        expect(req.request.method).toEqual("GET");

        // specify which test data should the mock http client return whenever we call the url
        req.flush(COURSES[12]);
    })

    it ("should save the course data", () => {
        const changes: Partial<Course> = { titles: {description: 'Testing Course'}};

        coursesService.saveCourse(12, changes )
            .subscribe(course => {

                expect(course.id).toBe(12);
        });

        const req = httpTesting.expectOne('/api/courses/12');

        expect(req.request.method).toBe("PUT");

        expect(req.request.body.titles.description).toBe(changes.titles.description);

        // check the returned data and the structure
        req.flush({
            ...COURSES[12],
            ...changes
        })

    })

    it ("should give an error if save course fails", () => {
        const changes: Partial<Course> = { titles: {description: 'Testing Course'}};

        coursesService.saveCourse(12, changes)
            .subscribe(
                () => fail("the save course should have failed"),
                (error: HttpErrorResponse) => {

                    expect(error.status).toBe(500);

                }
        );

        const req = httpTesting.expectOne('/api/courses/12');
        expect(req.request.method).toBe("PUT");

        req.flush('Save course failed', { 
            status: 500, 
            statusText: 'Internal Server Error'
        })

    })

    it ("should find lessons", () => {

        coursesService.findLessons(12)
            .subscribe(lessons => {

                // check if we receive some data
                expect(lessons).toBeTruthy();

                // lessons length should be 3 (pageSize = 3)
                expect(lessons.length).toBe(3);
        });

        // in case there are some params after the url
        const req = httpTesting.expectOne(req => 
            req.url == '/api/lessons'
        );

        expect(req.request.method).toBe("GET");

        // params is only string
        expect(req.request.params.get("courseId")).toBe("12");

        expect(req.request.params.get("filter")).toBe("");
        expect(req.request.params.get("sortOrder")).toBe("asc");
        expect(req.request.params.get("pageNumber")).toBe("0");
        expect(req.request.params.get("pageSize")).toBe("3");

        req.flush({
            payload: findLessonsForCourse(12).slice(0, 3)
        })

    })

    afterEach(() => {
        // make sure no other http requests are being made accidentally. 
        httpTesting.verify();
    })
})