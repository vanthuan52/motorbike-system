import { Injectable } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { IMessageService } from '../interfaces/message.service.interface';
import { ENUM_MESSAGE_LANGUAGE } from '../enums/message.enum';
import { HelperArrayService } from '@/common/helper/services/helper.array.service';
import {
  IMessageErrorOptions,
  IMessageSetOptions,
  IMessageValidationError,
  IMessageValidationImportError,
  IMessageValidationImportErrorParam,
} from '../interfaces/message.interface';

@Injectable()
export class MessageService implements IMessageService {
  private readonly defaultLanguage: ENUM_MESSAGE_LANGUAGE;
  private readonly availableLanguage: ENUM_MESSAGE_LANGUAGE[];
  private readonly debug: boolean;

  constructor(
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
    private readonly helperArrayService: HelperArrayService,
  ) {
    this.defaultLanguage =
      this.configService.get<ENUM_MESSAGE_LANGUAGE>('message.language') ??
      ENUM_MESSAGE_LANGUAGE.EN;
    this.availableLanguage = this.configService.get<ENUM_MESSAGE_LANGUAGE[]>(
      'message.availableLanguage',
    ) ?? [ENUM_MESSAGE_LANGUAGE.VI, ENUM_MESSAGE_LANGUAGE.EN];
    this.debug = this.configService.get<boolean>('debug.enable', {
      infer: true,
    });
  }

  // Filter message base on available language
  filterLanguage(customLanguage: string): string[] {
    return this.helperArrayService.getIntersection(
      [customLanguage],
      this.availableLanguage,
    );
  }

  // Set message by path base on language
  setMessage(path: string, options?: IMessageSetOptions): string {
    const language: string = options?.customLanguage
      ? this.filterLanguage(options.customLanguage)[0]
      : this.defaultLanguage;

    return this.i18n.translate(path, {
      lang: language,
      args: options?.properties,
      debug: this.debug,
    }) as any;
  }

  setValidationMessage(
    errors: ValidationError[],
    options?: IMessageErrorOptions,
  ): IMessageValidationError[] {
    const messages: IMessageValidationError[] = [];
    for (const error of errors) {
      let property = error.property;

      const constraints: string[] = Object.keys(error.constraints ?? []);
      if (constraints.length === 0) {
        let children: ValidationError[] = error.children ?? [];
        let lastConstraint: Record<string, string> = {};

        while (children.length > 0) {
          const child = children[0];

          lastConstraint = child.constraints ?? {};
          property = `${property}.${child.property}`;
          children = children[0].children ?? [];
        }

        constraints.push(...Object.keys(lastConstraint ?? []));
      }
      for (const constraint of constraints) {
        const message = this.setMessage(`request.${constraint}`, {
          customLanguage: options?.customLanguage,
          properties: {
            property: property.split('.').pop() ?? 0,
            value: error.value,
          },
        });

        messages.push({
          property,
          message: message,
        });
      }
    }

    return messages;
  }

  setValidationImportMessage(
    errors: IMessageValidationImportErrorParam[],
    options?: IMessageErrorOptions,
  ): IMessageValidationImportError[] {
    return errors.map((val) => ({
      row: val.row,
      sheetName: val.sheetName,
      errors: this.setValidationMessage(val.errors, options),
    }));
  }
}
