import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let router: Router;

    beforeEach(() => {
        localStorage.clear();

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([]),
            ],
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
        router = TestBed.inject(Router);
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return false for isAuthenticated when no token exists', () => {
        expect(service.isAuthenticated()).toBeFalse();
    });

    it('should return false for isAuthenticated with an expired token', () => {
        // Create a JWT with an expired timestamp
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({ sub: '1', exp: Math.floor(Date.now() / 1000) - 3600 }));
        const fakeToken = `${header}.${payload}.fake-signature`;
        localStorage.setItem('auth_token', fakeToken);

        expect(service.isAuthenticated()).toBeFalse();
    });

    it('should return true for isAuthenticated with a valid token', () => {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({ sub: '1', exp: Math.floor(Date.now() / 1000) + 3600 }));
        const fakeToken = `${header}.${payload}.fake-signature`;
        localStorage.setItem('auth_token', fakeToken);

        expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return the stored token from getToken', () => {
        localStorage.setItem('auth_token', 'my-test-token');
        expect(service.getToken()).toEqual('my-test-token');
    });

    it('should return null from getToken when no token exists', () => {
        expect(service.getToken()).toBeNull();
    });

    it('should clear token and navigate to /login on logout', () => {
        localStorage.setItem('auth_token', 'some-token');
        spyOn(router, 'navigate');

        service.logout();

        expect(localStorage.getItem('auth_token')).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
});
