const { CalendarFileType, StageStatus, ThresholdOperator, Decade, StageImageType } = require("@prisma/client");

const tenDayLabelToEnum = (label) => {
  if (!label) return null;
  switch (label) {
    case "上旬":
      return Decade.UPPER;
    case "中旬":
      return Decade.MIDDLE;
    case "下旬":
      return Decade.LOWER;
    default:
      return null;
  }
};

const tenDayEnumToLabel = (value) => {
  if (!value) return null;
  switch (value) {
    case Decade.UPPER:
      return "上旬";
    case Decade.MIDDLE:
      return "中旬";
    case Decade.LOWER:
      return "下旬";
    default:
      return null;
  }
};

const tenDayDecadeToEnum = (decade) => {
  if (!decade) return null;
  switch (decade) {
    case "upper":
      return Decade.UPPER;
    case "middle":
      return Decade.MIDDLE;
    case "lower":
      return Decade.LOWER;
    default:
      return null;
  }
};

const tenDayEnumToDecade = (value) => {
  if (!value) return null;
  switch (value) {
    case Decade.UPPER:
      return "upper";
    case Decade.MIDDLE:
      return "middle";
    case Decade.LOWER:
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
