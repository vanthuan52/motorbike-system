import { DatabaseProp } from '@/common/database/decorators/database.decorator';

/**
 * Embedded document for browser information
 */
export class SessionUserAgentBrowserEntity {
  @DatabaseProp({
    required: false,
    type: String,
  })
  name?: string;

  @DatabaseProp({
    required: false,
    type: String,
  })
  version?: string;

  @DatabaseProp({
    required: false,
    type: String,
  })
  major?: string;

  @DatabaseProp({
    required: false,
    type: String,
  })
  type?: string;
}

/**
 * Embedded document for CPU information
 */
export class SessionUserAgentCpuEntity {
  @DatabaseProp({
    required: false,
    type: String,
  })
  architecture?: string;
}

/**
 * Embedded document for device information
 */
export class SessionUserAgentDeviceEntity {
  @DatabaseProp({
    required: false,
    type: String,
  })
  type?: string;

  @DatabaseProp({
    required: false,
    type: String,
  })
  vendor?: string;

  @DatabaseProp({
    required: false,
    type: String,
  })
  model?: string;
}

/**
 * Embedded document for engine information
 */
export class SessionUserAgentEngineEntity {
  @DatabaseProp({
    required: false,
    type: String,
  })
  name?: string;

  @DatabaseProp({
    required: false,
    type: String,
  })
  version?: string;
}

/**
 * Embedded document for OS information
 */
export class SessionUserAgentOsEntity {
  @DatabaseProp({
    required: false,
    type: String,
  })
  name?: string;

  @DatabaseProp({
    required: false,
    type: String,
  })
  version?: string;
}

/**
 * Embedded document for user agent information
 * This is stored as an object property within SessionEntity
 */
export class SessionUserAgentEntity {
  @DatabaseProp({
    required: false,
    type: String,
  })
  ua?: string;

  @DatabaseProp({
    required: false,
    type: SessionUserAgentBrowserEntity,
    _id: false,
  })
  browser?: SessionUserAgentBrowserEntity;

  @DatabaseProp({
    required: false,
    type: SessionUserAgentCpuEntity,
    _id: false,
  })
  cpu?: SessionUserAgentCpuEntity;

  @DatabaseProp({
    required: false,
    type: SessionUserAgentDeviceEntity,
    _id: false,
  })
  device?: SessionUserAgentDeviceEntity;

  @DatabaseProp({
    required: false,
    type: SessionUserAgentEngineEntity,
    _id: false,
  })
  engine?: SessionUserAgentEngineEntity;

  @DatabaseProp({
    required: false,
    type: SessionUserAgentOsEntity,
    _id: false,
  })
  os?: SessionUserAgentOsEntity;
}
