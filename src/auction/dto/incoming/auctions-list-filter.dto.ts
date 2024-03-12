import { FindAllAuctionsFilter } from '../../auction.service';
import { PaginationDto } from '../../../shared/dto/incoming/pagination.dto';

export class AuctionsListFilterDto
  extends PaginationDto
  implements FindAllAuctionsFilter {}
