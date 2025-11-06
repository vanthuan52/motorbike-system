import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { CareRecordEntity } from '@/modules/care-record/entities/care-record.entity';
import {
  ENUM_BODY_CONDITION,
  ENUM_EXHAUST_COVER_CONDITION,
  ENUM_OIL_LEVEL,
  ENUM_REARVIEW_MIRROR_CONDITION,
  ENUM_SEAT_CONDITION,
} from '../enums/care-record-condition.enum';

export const CareRecordConditionTableName = 'care_record_conditions';

@DatabaseEntity({
  collection: CareRecordConditionTableName,
})
@DatabaseEntity({
  collection: CareRecordConditionTableName,
})
export class CareRecordConditionEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    ref: () => CareRecordEntity.name,
    index: true,
  })
  careRecord: string;

  @DatabaseProp({ required: false, type: Number })
  odoKm?: number;

  @DatabaseProp({ required: true, default: false })
  odoKmFaulty?: boolean;

  @DatabaseProp({ required: false, type: Number, min: 0, max: 100 })
  fuelLevelPercent?: number;

  @DatabaseProp({ required: true, default: false })
  fuelLevelFaulty: boolean;

  // Dầu nhớt máy (Sử dụng ENUM_OIL_LEVEL: full | low | empty)
  @DatabaseProp({
    required: true,
    default: ENUM_OIL_LEVEL.FULL,
    type: String,
    enum: ENUM_OIL_LEVEL,
  })
  engineOilLevel: ENUM_OIL_LEVEL;

  // Kiếng hậu (Sử dụng ENUM_REARVIEW_MIRROR_CONDITION: Có | Không)
  @DatabaseProp({
    required: true,
    default: ENUM_REARVIEW_MIRROR_CONDITION.PRESENT,
    type: String,
    enum: ENUM_REARVIEW_MIRROR_CONDITION,
  })
  rearviewMirrorCondition: ENUM_REARVIEW_MIRROR_CONDITION;

  // Yên xe (Sử dụng ENUM_SEAT_CONDITION: Ok | Rách)
  @DatabaseProp({
    required: true,
    default: ENUM_SEAT_CONDITION.OK,
    type: String,
    enum: ENUM_SEAT_CONDITION,
  })
  seatCondition: ENUM_SEAT_CONDITION;

  // Dàn áo (Sử dụng ENUM_BODY_CONDITION: Ok | Trầy | Bể)
  @DatabaseProp({
    required: true,
    default: ENUM_BODY_CONDITION.OK,
    type: String,
    enum: ENUM_BODY_CONDITION,
  })
  bodyCondition: ENUM_BODY_CONDITION;

  // Ốp pô (Sử dụng ENUM_EXHAUST_COVER_CONDITION: Có | Không | Bể)
  @DatabaseProp({
    required: true,
    default: ENUM_EXHAUST_COVER_CONDITION.PRESENT,
    type: String,
    enum: ENUM_EXHAUST_COVER_CONDITION,
  })
  exhaustCoverCondition: ENUM_EXHAUST_COVER_CONDITION;

  // PHỤ KIỆN VÀ VẬT PHẨM ĐI KÈM
  // ----------------------------------------

  // Baga (Có/Không)
  @DatabaseProp({ required: true, default: false })
  hasLuggageRack: boolean;

  // Thảm lót chân (Có/Không)
  @DatabaseProp({ required: true, default: false })
  hasFootMat: boolean;

  // Cao su gác chân (Có/Không)
  @DatabaseProp({ required: true, default: false })
  hasFootPegRubber: boolean;

  // Vật phẩm cốp xe
  @DatabaseProp({ required: true, default: false })
  hasRaincoat: boolean; // Áo mưa

  @DatabaseProp({ required: true, default: false })
  hasHelmet: boolean; // Nón BH

  // GHI CHÚ VÀ TÀI LIỆU
  // ----------------------------------------

  // Ghi chú về Phụ kiện & Inox (bao gồm Kiếng hậu, Baga,...)
  // Các dấu "……" gợi ý về nhu cầu ghi chú chi tiết
  @DatabaseProp({ required: false, trim: true, maxlength: 500 })
  accessoriesAndInoxNotes?: string;

  // Ghi chú tổng thể về Tình trạng hiện hành
  @DatabaseProp({ required: false, trim: true, maxlength: 1000 })
  currentConditionNotes?: string;

  // Tài liệu hình ảnh/video (Giữ nguyên)
  @DatabaseProp({ required: false, trim: true, maxlength: 255 })
  videoUrl?: string;

  @DatabaseProp({ required: false, type: [String] })
  imageUrls?: string[];
}

export const CareRecordConditionSchema = DatabaseSchema(
  CareRecordConditionEntity,
);

export type CareRecordConditionDoc =
  IDatabaseDocument<CareRecordConditionEntity>;
