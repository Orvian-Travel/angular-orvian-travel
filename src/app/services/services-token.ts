import { InjectionToken } from "@angular/core";
import { IUserService } from "./api/user/user-service.interface";
import { IPackageService } from "./api/package/package-service.interface";
import { ITravelerService } from "./api/traveler/traveler-service.interface";
import { IReservationService } from "./api/reservation/reservation-service.interface";
import { IPaymentService } from "./api/payment/payment-service.interface";
import { IAuthService } from "./api/auth/auth-service.interface";
import { IDialogManager } from "./dialog/dialog-manager.interface";
import { IAdminService } from "./api/admin/admin-service.interface";

export const SERVICES_TOKEN = {
  HTTP: {
    PACKAGE: new InjectionToken<IPackageService>('SERVICES_TOKEN.HTTP.PACKAGE'),
    USER: new InjectionToken<IUserService>('SERVICES_TOKEN.HTTP.USER'),
    TRAVELER: new InjectionToken<ITravelerService>('SERVICES_TOKEN.HTTP.TRAVELER'),
    RESERVATION: new InjectionToken<IReservationService>('SERVICES_TOKEN.HTTP.RESERVATION'),
    PAYMENT: new InjectionToken<IPaymentService>('SERVICES_TOKEN.HTTP.PAYMENT'),
    AUTH: new InjectionToken<IAuthService>('SERVICES_TOKEN.HTTP.AUTH'),
    ADMIN: new InjectionToken<IAdminService>('SERVICES_TOKEN.HTTP.ADMIN')
  },
  DIALOG: new InjectionToken<IDialogManager>('SERVICES_TOKEN.DIALOG')
}
