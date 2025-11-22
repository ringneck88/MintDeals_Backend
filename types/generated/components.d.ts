import type { Schema, Struct } from '@strapi/strapi';

export interface CommonAddress extends Struct.ComponentSchema {
  collectionName: 'components_common_addresses';
  info: {
    description: 'Standard address component with street, city, state, zip, and country';
    displayName: 'Address';
  };
  attributes: {
    city: Schema.Attribute.String & Schema.Attribute.Required;
    country: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'United States'>;
    state: Schema.Attribute.String & Schema.Attribute.Required;
    street: Schema.Attribute.String & Schema.Attribute.Required;
    zipCode: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CommonContestTitle extends Struct.ComponentSchema {
  collectionName: 'components_common_contest_titles';
  info: {
    displayName: 'ContestTitle';
    icon: 'handHeart';
  };
  attributes: {
    ContestLegalStatment: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    ContestTitle: Schema.Attribute.String;
  };
}

export interface CommonGeoArea extends Struct.ComponentSchema {
  collectionName: 'components_common_geo_areas';
  info: {
    displayName: 'Geo Area';
    icon: 'earth';
  };
  attributes: {
    Name: Schema.Attribute.String & Schema.Attribute.Required;
    WKT: Schema.Attribute.Text;
  };
}

export interface CommonGeoPoint extends Struct.ComponentSchema {
  collectionName: 'components_common_geo_points';
  info: {
    description: 'Geographic coordinates with latitude and longitude';
    displayName: 'Geo Point';
  };
  attributes: {
    lat: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 90;
        },
        number
      >;
    long: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 180;
        },
        number
      >;
  };
}

export interface CommonHours extends Struct.ComponentSchema {
  collectionName: 'components_common_hours';
  info: {
    description: 'Operating hours for a specific day of the week';
    displayName: 'Hours';
  };
  attributes: {
    closeTime: Schema.Attribute.Time;
    dayOfWeek: Schema.Attribute.Enumeration<
      [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ]
    > &
      Schema.Attribute.Required;
    is24hours: Schema.Attribute.Boolean;
    isClosed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    openTime: Schema.Attribute.Time;
  };
}

export interface CommonHoursException extends Struct.ComponentSchema {
  collectionName: 'components_common_hours_exceptions';
  info: {
    description: 'Special hours or closures for specific dates (holidays, events, etc.)';
    displayName: 'Hours Exception';
  };
  attributes: {
    closeTime: Schema.Attribute.Time;
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    isClosed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    openTime: Schema.Attribute.Time;
    reason: Schema.Attribute.String;
  };
}

export interface DiscountAppliesToLocation extends Struct.ComponentSchema {
  collectionName: 'components_discount_applies_to_locations';
  info: {
    description: 'Location where discount applies';
    displayName: 'Applies To Location';
    icon: 'map-marker';
  };
  attributes: {
    locationName: Schema.Attribute.String;
  };
}

export interface DiscountDiscountGroup extends Struct.ComponentSchema {
  collectionName: 'components_discount_discount_groups';
  info: {
    description: 'Discount group reference';
    displayName: 'Discount Group';
    icon: 'layer-group';
  };
  attributes: {
    discountGroupId: Schema.Attribute.String;
    discountGroupName: Schema.Attribute.String;
  };
}

export interface DiscountIdFilter extends Struct.ComponentSchema {
  collectionName: 'components_discount_id_filters';
  info: {
    description: 'Filter with IDs and exclusion flag';
    displayName: 'ID Filter';
    icon: 'filter';
  };
  attributes: {
    ids: Schema.Attribute.JSON;
    isExclusion: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface DiscountWeeklyRecurrence extends Struct.ComponentSchema {
  collectionName: 'components_discount_weekly_recurrences';
  info: {
    description: 'Weekly schedule for discount';
    displayName: 'Weekly Recurrence';
    icon: 'calendar';
  };
  attributes: {
    appliesOnFriday: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    appliesOnMonday: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    appliesOnSaturday: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    appliesOnSunday: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    appliesOnThursday: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    appliesOnTuesday: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    appliesOnWednesday: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    endTime: Schema.Attribute.String;
    startTime: Schema.Attribute.String;
  };
}

export interface DosingDosingCannabinoidsPerDose
  extends Struct.ComponentSchema {
  collectionName: 'components_dosing_dosing_cannabinoids_per_doses';
  info: {
    displayName: 'DosingCannabinoidsPerDose';
    icon: 'seed';
  };
  attributes: {
    Amount: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 500;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    Cannabinoid: Schema.Attribute.Enumeration<['THC', 'CBD']>;
    Per: Schema.Attribute.Enumeration<['Dose', 'Chew', 'Package']>;
    unit: Schema.Attribute.Enumeration<['Gram', 'onuce', 'Pound', 'ML', 'ml']>;
  };
}

export interface InventoryLabResult extends Struct.ComponentSchema {
  collectionName: 'components_inventory_lab_results';
  info: {
    description: 'Lab test result data';
    displayName: 'Lab Result';
    icon: 'flask';
  };
  attributes: {
    labResultUnit: Schema.Attribute.String;
    labResultUnitId: Schema.Attribute.String;
    labTest: Schema.Attribute.String;
    value: Schema.Attribute.Decimal;
  };
}

export interface InventoryLineage extends Struct.ComponentSchema {
  collectionName: 'components_inventory_lineages';
  info: {
    description: 'Package lineage data';
    displayName: 'Lineage';
    icon: 'link';
  };
  attributes: {
    antecedentBatchName: Schema.Attribute.String;
    antecedentIsHarvest: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    antecedentPackageDistance: Schema.Attribute.Integer;
    batchName: Schema.Attribute.String;
    packageId: Schema.Attribute.String;
  };
}

export interface InventoryRoomQuantity extends Struct.ComponentSchema {
  collectionName: 'components_inventory_room_quantities';
  info: {
    description: 'Room inventory quantity data';
    displayName: 'Room Quantity';
    icon: 'warehouse';
  };
  attributes: {
    quantityAvailable: Schema.Attribute.Decimal;
    room: Schema.Attribute.String;
    roomId: Schema.Attribute.String;
  };
}

export interface InventoryTag extends Struct.ComponentSchema {
  collectionName: 'components_inventory_tags';
  info: {
    description: 'Inventory tag data';
    displayName: 'Tag';
    icon: 'tag';
  };
  attributes: {
    packageId: Schema.Attribute.String;
    tagId: Schema.Attribute.String;
    tagName: Schema.Attribute.String;
  };
}

export interface LegalDisclaimer extends Struct.ComponentSchema {
  collectionName: 'components_legal_disclaimers';
  info: {
    description: 'Legal disclaimers with title, content, and type';
    displayName: 'Disclaimer';
  };
  attributes: {
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      [
        'general',
        'medical',
        'legal',
        'financial',
        'liability',
        'privacy',
        'terms',
      ]
    > &
      Schema.Attribute.DefaultTo<'general'>;
  };
}

export interface OpsFulfillmentRules extends Struct.ComponentSchema {
  collectionName: 'components_ops_fulfillment_rules';
  info: {
    description: 'Rules for order fulfillment including minimums, maximums, and delivery options';
    displayName: 'Fulfillment Rules';
  };
  attributes: {
    deliveryEnabled: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    deliveryRadius: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    maxOrderAmount: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    minOrderAmount: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    pickupEnabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface PageBlocks extends Struct.ComponentSchema {
  collectionName: 'components_page_blocks';
  info: {
    description: 'Dynamic page blocks component';
    displayName: 'blocks';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    media: Schema.Attribute.Media<'images' | 'videos', true>;
    title: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<
      ['hero', 'content', 'cta', 'gallery', 'testimonial']
    > &
      Schema.Attribute.DefaultTo<'content'>;
  };
}

export interface SeoMeta extends Struct.ComponentSchema {
  collectionName: 'components_seo_metas';
  info: {
    description: 'SEO metadata component';
    displayName: 'meta';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.Text;
    metaRobots: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String;
    metaViewport: Schema.Attribute.String;
    structuredData: Schema.Attribute.JSON;
  };
}

export interface StoreAmenityTag extends Struct.ComponentSchema {
  collectionName: 'components_store_amenity_tags';
  info: {
    description: 'Store amenities with icon and description';
    displayName: 'Amenity Tag';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface StoreOffer extends Struct.ComponentSchema {
  collectionName: 'components_store_offers';
  info: {
    description: 'Store offers and deals';
    displayName: 'Offer';
  };
  attributes: {
    description: Schema.Attribute.Text;
    discount_type: Schema.Attribute.Enumeration<
      ['percentage', 'fixed_amount', 'bogo', 'other']
    >;
    discount_value: Schema.Attribute.String;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    terms: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    valid_from: Schema.Attribute.Date;
    valid_until: Schema.Attribute.Date;
  };
}

export interface StoreServiceTag extends Struct.ComponentSchema {
  collectionName: 'components_store_service_tags';
  info: {
    description: 'Service offerings with icon and description';
    displayName: 'Service Tag';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface UiButton extends Struct.ComponentSchema {
  collectionName: 'components_ui_buttons';
  info: {
    displayName: 'Button';
    icon: 'command';
  };
  attributes: {};
}

export interface UiCta extends Struct.ComponentSchema {
  collectionName: 'components_ui_ctas';
  info: {
    description: 'Call-to-action component with text, link, and style';
    displayName: 'CTA';
  };
  attributes: {
    link: Schema.Attribute.String & Schema.Attribute.Required;
    style: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'outline', 'ghost', 'link']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface UiCtaBlock extends Struct.ComponentSchema {
  collectionName: 'components_ui_cta_blocks';
  info: {
    displayName: 'CTA Block';
    icon: 'brush';
  };
  attributes: {};
}

export interface UiEventBlock extends Struct.ComponentSchema {
  collectionName: 'components_ui_event_blocks';
  info: {
    displayName: 'Event Block';
    icon: 'headphone';
  };
  attributes: {};
}

export interface UiFaq extends Struct.ComponentSchema {
  collectionName: 'components_ui_faqs';
  info: {
    displayName: 'FAQ';
    icon: 'book';
  };
  attributes: {
    Question: Schema.Attribute.Component<'ui.question', true>;
  };
}

export interface UiGlobalFooter extends Struct.ComponentSchema {
  collectionName: 'components_ui_global_footers';
  info: {
    displayName: 'Global Footer';
    icon: 'arrowDown';
  };
  attributes: {
    Logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    LogoLink: Schema.Attribute.String;
  };
}

export interface UiGlobalHeader extends Struct.ComponentSchema {
  collectionName: 'components_ui_global_headers';
  info: {
    displayName: 'Global Header';
    icon: 'alien';
  };
  attributes: {};
}

export interface UiGlobalLeftSidebar extends Struct.ComponentSchema {
  collectionName: 'components_ui_global_left_sidebars';
  info: {
    displayName: 'Global left Sidebar';
    icon: 'arrowLeft';
  };
  attributes: {};
}

export interface UiGlobalLink extends Struct.ComponentSchema {
  collectionName: 'components_ui_global_links';
  info: {
    displayName: 'Global Link';
    icon: 'attachment';
  };
  attributes: {};
}

export interface UiGlobalLogoLink extends Struct.ComponentSchema {
  collectionName: 'components_ui_global_logo_links';
  info: {
    displayName: 'Global Logo Link';
    icon: 'attachment';
  };
  attributes: {};
}

export interface UiGlobalRightSidebar extends Struct.ComponentSchema {
  collectionName: 'components_ui_global_right_sidebars';
  info: {
    displayName: 'Global Right Sidebar';
    icon: 'arrowRight';
  };
  attributes: {};
}

export interface UiGlobalTopNavigation extends Struct.ComponentSchema {
  collectionName: 'components_ui_global_top_navigations';
  info: {
    displayName: 'Global Top Navigation';
    icon: 'stack';
  };
  attributes: {};
}

export interface UiHeadingBlock extends Struct.ComponentSchema {
  collectionName: 'components_ui_heading_blocks';
  info: {
    displayName: 'HeadingBlock';
    icon: 'bold';
  };
  attributes: {
    anchorLink: Schema.Attribute.String;
    Heading: Schema.Attribute.String;
    subHeading: Schema.Attribute.String;
  };
}

export interface UiHero extends Struct.ComponentSchema {
  collectionName: 'components_ui_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {};
}

export interface UiImage extends Struct.ComponentSchema {
  collectionName: 'components_ui_images';
  info: {
    displayName: 'Image';
    icon: 'picture';
  };
  attributes: {
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    ImageAltTag: Schema.Attribute.Text;
    ImageTitle: Schema.Attribute.String;
  };
}

export interface UiLogoLink extends Struct.ComponentSchema {
  collectionName: 'components_ui_logo_links';
  info: {
    displayName: 'Logo Link';
    icon: 'attachment';
  };
  attributes: {};
}

export interface UiQuestion extends Struct.ComponentSchema {
  collectionName: 'components_ui_question_s';
  info: {
    displayName: 'Question ';
    icon: 'key';
  };
  attributes: {
    Answer: Schema.Attribute.Text;
    Question: Schema.Attribute.String;
  };
}

export interface UiRegionCard extends Struct.ComponentSchema {
  collectionName: 'components_ui_region_cards';
  info: {
    displayName: 'Region Card';
    icon: 'rocket';
  };
  attributes: {};
}

export interface UiReviewsBlock extends Struct.ComponentSchema {
  collectionName: 'components_ui_reviews_blocks';
  info: {
    displayName: 'Reviews Block';
    icon: 'doctor';
  };
  attributes: {};
}

export interface UiRichTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_ui_rich_text_blocks';
  info: {
    displayName: 'Rich Text Block';
    icon: 'layer';
  };
  attributes: {};
}

export interface UiStoreBrandsBlock extends Struct.ComponentSchema {
  collectionName: 'components_ui_store_brands_blocks';
  info: {
    displayName: 'Store Brands Block';
    icon: 'dashboard';
  };
  attributes: {};
}

export interface UiStoreLocationBlock extends Struct.ComponentSchema {
  collectionName: 'components_ui_store_location_blocks';
  info: {
    displayName: 'Store Location Block';
    icon: 'pin';
  };
  attributes: {};
}

export interface UiTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_ui_text_blocks';
  info: {
    displayName: 'TextBlock';
    icon: 'bulletList';
  };
  attributes: {
    TextHTML: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Title: Schema.Attribute.String;
  };
}

export interface UiTwoColumnImageBlockWithText extends Struct.ComponentSchema {
  collectionName: 'components_ui_two_column_image_block_with_texts';
  info: {
    displayName: 'TwoColumnImageBlockWithText';
    icon: 'picture';
  };
  attributes: {
    Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    ImageAlttext: Schema.Attribute.Text;
    ImageOnRight: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    ImageTitle: Schema.Attribute.String;
    Text: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'common.address': CommonAddress;
      'common.contest-title': CommonContestTitle;
      'common.geo-area': CommonGeoArea;
      'common.geo-point': CommonGeoPoint;
      'common.hours': CommonHours;
      'common.hours-exception': CommonHoursException;
      'discount.applies-to-location': DiscountAppliesToLocation;
      'discount.discount-group': DiscountDiscountGroup;
      'discount.id-filter': DiscountIdFilter;
      'discount.weekly-recurrence': DiscountWeeklyRecurrence;
      'dosing.dosing-cannabinoids-per-dose': DosingDosingCannabinoidsPerDose;
      'inventory.lab-result': InventoryLabResult;
      'inventory.lineage': InventoryLineage;
      'inventory.room-quantity': InventoryRoomQuantity;
      'inventory.tag': InventoryTag;
      'legal.disclaimer': LegalDisclaimer;
      'ops.fulfillment-rules': OpsFulfillmentRules;
      'page.blocks': PageBlocks;
      'seo.meta': SeoMeta;
      'store.amenity-tag': StoreAmenityTag;
      'store.offer': StoreOffer;
      'store.service-tag': StoreServiceTag;
      'ui.button': UiButton;
      'ui.cta': UiCta;
      'ui.cta-block': UiCtaBlock;
      'ui.event-block': UiEventBlock;
      'ui.faq': UiFaq;
      'ui.global-footer': UiGlobalFooter;
      'ui.global-header': UiGlobalHeader;
      'ui.global-left-sidebar': UiGlobalLeftSidebar;
      'ui.global-link': UiGlobalLink;
      'ui.global-logo-link': UiGlobalLogoLink;
      'ui.global-right-sidebar': UiGlobalRightSidebar;
      'ui.global-top-navigation': UiGlobalTopNavigation;
      'ui.heading-block': UiHeadingBlock;
      'ui.hero': UiHero;
      'ui.image': UiImage;
      'ui.logo-link': UiLogoLink;
      'ui.question': UiQuestion;
      'ui.region-card': UiRegionCard;
      'ui.reviews-block': UiReviewsBlock;
      'ui.rich-text-block': UiRichTextBlock;
      'ui.store-brands-block': UiStoreBrandsBlock;
      'ui.store-location-block': UiStoreLocationBlock;
      'ui.text-block': UiTextBlock;
      'ui.two-column-image-block-with-text': UiTwoColumnImageBlockWithText;
    }
  }
}
