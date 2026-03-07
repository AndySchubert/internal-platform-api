import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/auth/auth.service';

describe('LoginComponent', () => {
    beforeEach(async () => {
        localStorage.clear();

        const mockAuthService = {
            currentUser$: of(null),
            loadCurrentUser: () => of(null),
            login: () => of(null),
            logout: () => { }
        };

        await TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([]),
                { provide: AuthService, useValue: mockAuthService }
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
