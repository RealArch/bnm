import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonDatetimeButton, IonDatetime, IonPopover, IonInput, IonText,
  IonSelect, IonSelectOption, IonButton, IonIcon, ModalController, IonList, IonFooter, IonSpinner, NavController, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, close, createOutline, alert, alertCircleOutline } from 'ionicons/icons'
import { ModalAddEquipmentPage } from './modal-add-equipment/modal-add-equipment.page';
import { ModalAddServicePage } from './modal-add-service/modal-add-service.page';
import { ModalAddMaterialsPage } from './modal-add-materials/modal-add-materials.page';
import { ActivatedRoute } from '@angular/router';
import { WorkOrdersService } from 'src/app/services/work-orders.service';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PopupsService } from 'src/app/services/popups.service';
import { CustomersService } from 'src/app/services/customers.service';
import { Customer } from 'src/app/interfaces/customers';
@Component({
  selector: 'app-add-work-order',
  templateUrl: './add-work-order.page.html',
  styleUrls: ['./add-work-order.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCard, IonSpinner, IonFooter, IonIcon, IonButton, IonText, IonPopover, IonDatetime,
    IonDatetimeButton, IonLabel, IonItem, IonCol, IonRow, IonGrid,
    IonButtons, IonBackButton, IonInput,
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,
    FormsModule, ReactiveFormsModule, IonSelect, IonSelectOption,
  ]
})
export class AddWorkOrderPage implements OnInit {
  modalCtrl = inject(ModalController)
  fb = inject(FormBuilder)
  route = inject(ActivatedRoute)
  workOrderService = inject(WorkOrdersService);
  navCtrl = inject(NavController);
  authService = inject(AuthService)
  popupService = inject(PopupsService)
  customersService = inject(CustomersService)

  saving: Boolean = false;
  addWorkOrderForm: FormGroup = this.fb.group({})
  type: string | null = null;
  loadingCustomers: boolean = true;
  customers: Customer[] = [];
  addressString: any = null;
  constructor() {
    addIcons({ createOutline, close, add, alert, alertCircleOutline });
    this.addWorkOrderForm = this.fb.group({
      startDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      closeDate: [null, []],
      // billTo: [null, [Validators.required]],
      customer: this.fb.group({
        id: [null, [Validators.required]],
        companyName: [null, []],
        companyPhone: [null, [Validators.required]],
        companyAddress: [null, [Validators.required]],
        contactName: [null, [Validators.required]],
        contactPhone: [null, [Validators.required]],
      }),
      notedEquipments: this.fb.array([]),
      servicesPerformed: this.fb.array([], [minLengthArray(1)]),
      materialsUsed: this.fb.array([]),
      type: [this.route.snapshot.paramMap.get('type'), [Validators.required]]

    })
  }
  // // 

  // companyAddress: {zip: "34771", city: "Saint Coud", street: "232 pine vally Rd", state: "FL"}

  // companyName: "Gatorade"

  // companyPhone: "4077023859"

  // contactName: "Denisse Roa"

  // contactPhone: "444444444"

  // creationDate: {_seconds: 1741387284, _nanoseconds: 49000000}

  // id: "uqjazTllgLR3tiXMj1K4"
  async ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type');
    //if type = work, add default close date to startDate: [new Date().toISOString().split('T')[0], [Validators.required]],
    if (this.type == 'work') {
      this.addWorkOrderForm.get('closeDate')?.setValue(new Date().toISOString().split('T')[0]);
      this.addWorkOrderForm.get('closeDate')?.setValidators([Validators.required]);
    }
    this.customers = await this.getCustomer() as Customer[]

  }
  get notedEquipments() {
    return this.addWorkOrderForm.get('notedEquipments') as FormArray;
  }
  get servicesPerformed() {
    return this.addWorkOrderForm.get('servicesPerformed') as FormArray;
  }
  get materialsUsed() {
    return this.addWorkOrderForm.get('materialsUsed') as FormArray;
  }
  get startDate() {
    return this.addWorkOrderForm.get('startDate') as FormArray;
  }
  get customer() {
    return this.addWorkOrderForm.get('customer') as FormGroup;
  }

  removeEquipment(index: number) {
    this.notedEquipments.removeAt(index)
  }
  removeService(index: number) {
    this.servicesPerformed.removeAt(index)
  }
  removeMaterial(index: number) {
    this.materialsUsed.removeAt(index)
  }

  //Get custonmers
  async getCustomer() {
    try {
      this.loadingCustomers = true;
      const customers: Customer[] = await this.customersService.getAllCustomersAlgolia()
      this.loadingCustomers = false
      return customers
    } catch (e) {
      console.log(e)
      this.popupService.presentToast('bottom', 'danger', 'There was a problem reading the data. Please try again.')
      return []
    }
  }
  onCustomerSelected(event: any) {
    const selectedCustomer = event.detail.value;
    console.log(selectedCustomer)
    // Actualiza el FormGroup 'customer' con los datos del cliente seleccionado



    if (this.customer) {
      // Usamos patchValue, que es más seguro y flexible.
      this.customer.patchValue({
        id: selectedCustomer.id,
        companyName: selectedCustomer.companyName, // Ahora incluimos este campo
        companyPhone: selectedCustomer.companyPhone,
        companyAddress: selectedCustomer.companyAddress,
        contactName: selectedCustomer.contactName,
        contactPhone: selectedCustomer.contactPhone,
      });

      // Si tienes una propiedad aparte para la dirección, actualízala aquí.
      // Aunque es mejor que esté dentro del FormGroup.
      this.addressString = selectedCustomer.companyAddress.street + ', ' +
        selectedCustomer.companyAddress.city + ', ' +
        selectedCustomer.companyAddress.state + ', ' +
        selectedCustomer.companyAddress.zip;
    }

  }
  // EQUIPMENT MODAL
  async openEquipmentModal(equipment: any = null, index: any = null) {
    const modal = await this.modalCtrl.create({
      component: ModalAddEquipmentPage,
      // 2. Pasamos el equipo y su índice al modal.
      componentProps: {
        equipment: equipment,
        index: index
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // 3. Verificamos el modo para saber si añadir o actualizar.
      if (data.mode === 'Add') {
        this.notedEquipments.push(this.fb.control(data.equipment));
      } else { // Si el modo es 'Edit'
        this.notedEquipments.at(data.index).setValue(data.equipment);
      }
    }
  }

  async createWorkOrder() {

    this.saving = true;
    console.log(this.addWorkOrderForm.getRawValue())
    var afAuthToken = await this.authService.getIdToken()

    this.workOrderService.addWorkOrder(this.addWorkOrderForm.getRawValue(), afAuthToken!).pipe(
      // El operador finalize asegura que 'saving' se ponga en 'false' siempre,
      // tanto si la petición tiene éxito como si falla.
      finalize(() => this.saving = false)
    ).subscribe({
      next: (response) => {
        this.popupService.presentToast('bottom', 'success', 'Work order created successfully.')
        // Opcional: Muestra un mensaje de éxito (ej. un Toast de Ionic)
        // Opcional: Navega a la página de lista de work orders
        this.navCtrl.navigateBack('/user/work-orders');
      },
      error: (error) => {
        console.error('error:', error);
        this.popupService.presentToast('bottom', 'danger', 'Failed to create work order. Please try again.')

        // Opcional: Muestra un mensaje de error al usuario
      }
    });
  }
  ////var afAuthToken = await this.authService.getIdToken()
  //SERVICES MODAL
  async openServiceModal(service: any = null, index: any = null) {


    const modal = await this.modalCtrl.create({
      component: ModalAddServicePage,
      // 2. Pasamos los datos al modal. Si service es nulo, el modal sabrá que es para añadir.
      componentProps: {
        service: service,
        index: index
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // 3. Verificamos el modo para saber si añadir o actualizar
      if (data.mode === 'Add') {
        // Añadimos un nuevo servicio al FormArray
        this.servicesPerformed.push(this.fb.control(data.service));
      } else { // Si el modo es 'Edit'
        // Actualizamos el servicio existente en el FormArray
        this.servicesPerformed.at(data.index).setValue(data.service);
      }
    }
  }

  //MATERIAL MODAL
  async openMaterialModal(material: any = null, index: any = null) {


    const modal = await this.modalCtrl.create({
      component: ModalAddMaterialsPage,
      componentProps: {
        material: material,
        index: index
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // 3. Verificamos e l modo para saber si añadir o actualizar
      if (data.mode === 'Add') {
        // Añadimos un nuevo servicio al FormArray
        this.materialsUsed.push(this.fb.control(data.material));
      } else { // Si el modo es 'Edit'
        // Actualizamos el servicio existente en el FormArray
        this.materialsUsed.at(data.index).setValue(data.material);
      }
    }
  }




}

export function minLengthArray(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control && control.value && Array.isArray(control.value) && control.value.length >= min) {
      return null;
    }
    return { minLengthArray: { requiredLength: min, actualLength: control.value?.length || 0 } };
  };
}
