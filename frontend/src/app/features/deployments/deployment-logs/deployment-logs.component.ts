import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DeploymentsService } from '../deployments.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { Subscription, interval, of } from 'rxjs';
import { switchMap, startWith, timeout, catchError } from 'rxjs/operators';

@Component({
    selector: 'app-deployment-logs',
    standalone: true,
    imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
    templateUrl: './deployment-logs.component.html',
    styleUrls: ['./deployment-logs.component.css']
})
export class DeploymentLogsComponent implements OnInit, OnDestroy {
    envId: string | null = null;
    depId: string | null = null;
    logs: string = '';
    loading = true;
    error: string | null = null;
    private pollSubscription?: Subscription;

    constructor(
        private route: ActivatedRoute,
        private deploymentsService: DeploymentsService,
        private ngZone: NgZone,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.envId = params.get('envId');
            this.depId = params.get('depId');
            console.log('DeploymentLogsComponent initialized with:', { envId: this.envId, depId: this.depId });

            if (this.depId) {
                this.ngZone.run(() => {
                    this.startPolling();
                });
            } else {
                this.ngZone.run(() => {
                    this.error = 'Invalid deployment ID.';
                    this.loading = false;
                    this.cdr.detectChanges();
                });
            }
        });
    }

    private startPolling(): void {
        this.pollSubscription?.unsubscribe();
        this.pollSubscription = interval(3000)
            .pipe(
                startWith(0),
                switchMap(() => {
                    console.log('Fetching logs for:', this.depId);
                    return this.deploymentsService.getDeploymentLogs(this.depId!).pipe(
                        timeout(5000),
                        catchError(err => {
                            console.error('Request timeout or error:', err);
                            return of({ logs: 'Error or timeout while fetching logs...' });
                        })
                    );
                })
            )
            .subscribe({
                next: (data) => {
                    console.log('Logs received:', data);
                    this.ngZone.run(() => {
                        this.logs = data.logs || 'No logs available yet...';
                        this.loading = false;
                        this.cdr.detectChanges();
                    });
                },
                error: (err) => {
                    console.error('Error fetching logs:', err);
                    this.ngZone.run(() => {
                        this.error = 'Failed to load deployment logs.';
                        this.loading = false;
                        this.cdr.detectChanges();
                    });
                }
            });
    }

    ngOnDestroy(): void {
        if (this.pollSubscription) {
            this.pollSubscription.unsubscribe();
        }
    }
}
