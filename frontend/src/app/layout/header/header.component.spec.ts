import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../shared/models/user.model';

describe('HeaderComponent', () => {
    let mockCurrentUser$: BehaviorSubject<User | null>;

    beforeEach(async () => {
        localStorage.clear();
        mockCurrentUser$ = new BehaviorSubject<User | null>(null);

        const mockAuthService = {
            currentUser$: mockCurrentUser$.asObservable(),
            logout: jasmine.createSpy('logout'),
        };

        await TestBed.configureTestingModule({
            imports: [HeaderComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([]),
                { provide: AuthService, useValue: mockAuthService },
            ],
        }).compileComponents();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should create the component', () => {
        const fixture = TestBed.createComponent(HeaderComponent);
        const component = fixture.componentInstance;
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should hide nav when user is not authenticated', () => {
        const fixture = TestBed.createComponent(HeaderComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.nav')).toBeNull();
        expect(compiled.querySelector('.user-menu')).toBeNull();
    });

    it('should show nav and user email when authenticated', () => {
        const fixture = TestBed.createComponent(HeaderComponent);
        fixture.detectChanges();

        mockCurrentUser$.next({ email: 'test@example.com' } as User);
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.nav')).toBeTruthy();
        expect(compiled.querySelector('.user-email')?.textContent).toContain('test@example.com');
    });

    it('should show logout button when authenticated', () => {
        const fixture = TestBed.createComponent(HeaderComponent);
        fixture.detectChanges();

        mockCurrentUser$.next({ email: 'test@example.com' } as User);
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.btn-logout')).toBeTruthy();
    });

    it('should call logout on button click', () => {
        const fixture = TestBed.createComponent(HeaderComponent);
        fixture.detectChanges();

        mockCurrentUser$.next({ email: 'test@example.com' } as User);
        fixture.detectChanges();

        const logoutBtn = fixture.nativeElement.querySelector('.btn-logout') as HTMLButtonElement;
        logoutBtn.click();

        const authService = TestBed.inject(AuthService);
        expect(authService.logout).toHaveBeenCalled();
    });
});
