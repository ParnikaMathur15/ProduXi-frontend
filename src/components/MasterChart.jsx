import LineChart from "./charts/LineChart";
import BarChart from "./charts/BarChart";
import StackChart from "./charts/StackChart";
import BMapChart from "./charts/BMapChart";

export default function MasterChart({ userId }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BarChart userId={userId} />
      <LineChart userId={userId} />
      <StackChart userId={userId} />
      <BMapChart userId={userId} />
    </div>
  );
}
