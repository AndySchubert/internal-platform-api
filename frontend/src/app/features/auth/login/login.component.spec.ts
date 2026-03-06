import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    beforeEach(async () => {
        localStorage.clear();

        await TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([]),
            ],
        }).compileComponents();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should create the component', () => {
        const fixture = TestBed.createComponent(LoginComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    it('should have an invalid form when empty', () => {
        const fixture = TestBed.createComponent(LoginComponent);
        const component = fixture.componentInstance;
        expect(component.loginForm.valid).toBeFalse();
    });

    it('should have a valid form with proper email and password', () => {
        const fixture = TestBed.createComponent(LoginComponent);
        const component = fixture.componentInstance;
        component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
        expect(component.loginForm.valid).toBeTrue();
    });

    it('should invalidate form with bad email', () => {
        const fixture = TestBed.createComponent(LoginComponent);
        const component = fixture.componentInstance;
        component.loginForm.setValue({ email: 'not-an-email', password: 'password123' });
        expect(component.loginForm.get('email')?.hasError('email')).toBeTrue();
    });

    it('should not submit when form is invalid', () => {
        const fixture = TestBed.createComponent(LoginComponent);
        const component = fixture.componentInstance;
        component.onSubmit();
        expect(component.loading).toBeFalse();
    });
});
