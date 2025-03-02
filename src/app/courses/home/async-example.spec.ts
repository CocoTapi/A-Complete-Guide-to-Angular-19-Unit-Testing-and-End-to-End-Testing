import { fakeAsync, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("Async Testing Examples", () => {

    // This works but not ideal especially for complex test. Don't know how long we need to wait.
    it ("Async test example with Jasmine done()", (done: DoneFn) => {

        let test = false;

        setTimeout(() => {
            // console.log('running assertions')

            test = true;

            expect(test).toBeTruthy();

            done();
        }, 1000)
    });

    // using zone.js
    it ("Async test example - setTimeOut()", fakeAsync(() => {
        let test = false;

        setTimeout(() => {
            // console.log('running assertion setTimeout()1')

            test = true;

            expect(test).toBeTruthy();
            // console.log('running assertion setTimeout()2')
        }, 1000);

        // TODO: without tick(1000) also works. Why?
        // tick(500);
    }));

    it("Async test example - plain Promise", fakeAsync(() => {
        let test = false;

        // console.log("1. creating promise");

        Promise.resolve().then(() => {
            // console.log("2. first then() evaluated");

            test = true;

            return Promise.resolve();
        }).then (() => {
            // console.log("3. Promise evaluated successfully.");
        })

        // Add this to prevent executing 4 before 2
        flushMicrotasks();

        // console.log("4. Running test assertions");

        expect(test).toBeTruthy();
    }));

    it ("Async test example - plain Promise + setTimeout()", fakeAsync(() => {
        let counter = 0;

        Promise.resolve().then(() => {
            counter += 10;

            setTimeout(() => {
                counter++;
            }, 1000);

        })

        expect(counter).toBe(0);

        flushMicrotasks();

        expect(counter).toBe(10);

        tick(500);

        expect(counter).toBe(10);

        tick(500);
        
        expect(counter).toBe(11);

    }));

    it ("Async test example - Observables", fakeAsync(() => {

        let test = false;

        // console.log('1');

        const test$ = of(test).pipe(delay(1000));

        test$.subscribe(() => {
            // console.log("2");
            test = true;
        })

        // need this if delay(1000)
        tick(1000);

        // console.log("3");
        expect(test).toBeTruthy();
    }));
});