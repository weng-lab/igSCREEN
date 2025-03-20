import Typography, { TypographyOwnProps, TypographyPropsVariantOverrides } from "@mui/material/Typography";

import { Launch } from "@mui/icons-material";
import { OverridableStringUnion } from "@mui/types";
import { Link } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";

export const CreateLink: React.FC<{
  linkPrefix: string;
  linkArg?: string;
  label: string;
  showExternalIcon?: boolean;
  variant?: OverridableStringUnion<
    Variant | "inherit",
    TypographyPropsVariantOverrides
  >;
  textColor?: string;
  underline?: "none" | "always" | "hover";
}> = (props) => {
  const link = props.linkPrefix + (props.linkArg ?? "");
  return (
    <Link
      variant={props.variant}
      href={link}
      rel="noopener noreferrer"
      target="_blank"
      color={props.textColor}
      underline={props.underline}
    >
      {props.label}
      {props.showExternalIcon && (
        <Launch
          sx={{ display: "inline-flex", verticalAlign: "middle", ml: 0.5 }}
          color="inherit"
          fontSize="inherit"
        />
      )}
    </Link>
  );
};

/**
 * @param num Number to convert to Sci Notation
 * @param variant MUI Typography Variant to be used
 * @param sigFigs Number of desired significant figures
 * @returns 
 */
export function toScientificNotationElement(num: number, sigFigs: number, typographyProps?: TypographyOwnProps) {
  if (num > 0.01) { return <Typography {...typographyProps}>{num.toFixed(2)}</Typography> }

  // Convert the number to scientific notation using toExponential
  let scientific = num.toExponential(sigFigs);
  let [coefficient, exponent] = scientific.split('e');
  
  return (
    <Typography {...typographyProps}>{coefficient}&nbsp;×&nbsp;10<sup>{exponent}</sup></Typography>
  )
}