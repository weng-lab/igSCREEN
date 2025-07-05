import { Rect } from "umms-gb/dist/components/tracks/bigbed/types";

export default function BedTooltip({item}: {item: Rect}) {
  return (
    <div style={{ fontSize: "10px", backgroundColor: "white", padding: "5px", boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)" }}>
      <div>{item.name}</div>
    </div>
  );
}
