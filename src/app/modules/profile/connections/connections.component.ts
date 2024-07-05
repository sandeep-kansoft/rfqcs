import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { UserDetail } from '../overview/user-detail';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Category } from '../campaigns/product';
import { ProfileService } from '../profile.service';
@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
})
export class ConnectionsComponent {


}


