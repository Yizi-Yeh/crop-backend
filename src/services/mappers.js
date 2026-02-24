const { CalendarFileType, StageStatus, ThresholdOperator, TenDay, StageImageType } = require("@prisma/client");

const tenDayLabelToEnum = (label) => {
  if (!label) return null;
  switch (label) {
    case "上旬":
      return TenDay.FIRST;
    case "中旬":
      return TenDay.MIDDLE;
    case "下旬":
      return TenDay.LAST;
    default:
      return null;
  }
};

const tenDayEnumToLabel = (value) => {
  if (!value) return null;
  switch (value) {
    case TenDay.FIRST:
      return "上旬";
    case TenDay.MIDDLE:
      return "中旬";
    case TenDay.LAST:
      return "下旬";
    default:
      return null;
  }
};

const tenDayDecadeToEnum = (decade) => {
  if (!decade) return null;
  switch (decade) {
    case "upper":
      return TenDay.FIRST;
    case "middle":
      return TenDay.MIDDLE;
    case "lower":
      return TenDay.LAST;
    default:
      return null;
  }
};

const tenDayEnumToDecade = (value) => {
  if (!value) return null;
  switch (value) {
    case TenDay.FIRST:
      return "upper";
    case TenDay.MIDDLE:
      return "middle";
    case TenDay.LAST:
      return "lower";
    default:
      return null;
  }
};

const fileTypeToEnum = (value) => {
  if (!value) return CalendarFileType.ORIGINAL;
  return value === "copy" ? CalendarFileType.COPY : CalendarFileType.ORIGINAL;
};

const fileTypeToString = (value) => {
  if (!value) return "original";
  return value === CalendarFileType.COPY ? "copy" : "original";
};

const stageStatusToEnum = (value) => {
  if (!value) return StageStatus.DRAFT;
  return value === "complete" ? StageStatus.COMPLETE : StageStatus.DRAFT;
};

const stageStatusToString = (value) => {
  if (!value) return "draft";
  return value === StageStatus.COMPLETE ? "complete" : "draft";
};

const operatorToEnum = (value) => {
  switch (value) {
    case ">":
      return ThresholdOperator.GT;
    case "<":
      return ThresholdOperator.LT;
    case ">=":
      return ThresholdOperator.GTE;
    case "<=":
      return ThresholdOperator.LTE;
    default:
      return ThresholdOperator.GT;
  }
};

const operatorToString = (value) => {
  switch (value) {
    case ThresholdOperator.GT:
      return ">";
    case ThresholdOperator.LT:
      return "<";
    case ThresholdOperator.GTE:
      return ">=";
    case ThresholdOperator.LTE:
      return "<=";
    default:
      return ">";
  }
};

const imageTypeToEnum = (value) => {
  return value === "cover" ? StageImageType.COVER : StageImageType.ALBUM;
};

module.exports = {
  tenDayLabelToEnum,
  tenDayEnumToLabel,
  tenDayDecadeToEnum,
  tenDayEnumToDecade,
  fileTypeToEnum,
  fileTypeToString,
  stageStatusToEnum,
  stageStatusToString,
  operatorToEnum,
  operatorToString,
  imageTypeToEnum,
};
