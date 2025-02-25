import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed } from '@angular/core/testing'
  
describe('CalculatorService', () => {
    let calculator: CalculatorService;
    let loggerSpy: any; 

    // this is a setup to avoid repeating codes
    beforeEach(() => {
        // loggerSpy = jasmine.createSpyObj('LoggerService', ["log"]);
        // calculator = new CalculatorService(loggerSpy);

        // setup test only implementation rather than inject real instances       
        TestBed.configureTestingModule({
            providers: [
                CalculatorService,
                {provide: LoggerService, useValue: loggerSpy}
            ]
        })

        calculator = TestBed.inject<CalculatorService>(CalculatorService);

        
    })

    it ('should add two numbers', () => {

        // const logger = jasmine.createSpyObj('LoggerService', ["log"]);
        // const logger = new LoggerService();
        // spyOn(logger, 'log');

        // prepare a component or service
        // const calculator = new CalculatorService(logger);

        // trigger the operation
        const result = calculator.add(2, 2);

        // expecting result
        expect(result).toBe(4);

        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    }); 

    it ('should subtract two numbers', () => {
        // const logger = jasmine.createSpyObj('LoggerService', ["log"]); 
        // const calculator = new CalculatorService(logger);

        const result = calculator.subtract(2, 2);

        expect(result).toBe(0, "subtraction result");    
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    });
})