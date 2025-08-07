import { Observable } from "rxjs";
import { TravelerDetail, SaveTravelerRequest, SaveTravelerResponse, UpdateTravelerRequest } from "../../entities/traveler.model";

export interface ITravelerService {
  getAllTravelers(): Observable<TravelerDetail[]>;

  getTravelerById(id: string): Observable<TravelerDetail>;

  createTraveler(saveTravelerRequest: SaveTravelerRequest): Observable<SaveTravelerResponse>;

  updateTraveler(id: string, updateTravelerRequest: UpdateTravelerRequest): Observable<void>;

  deleteTraveler(id: string): Observable<void>;
}
