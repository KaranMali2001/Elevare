import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

function Skelton() {
  return (
    <div className="w-full p-4 mx-auto">
      <SkeletonTheme borderRadius={"50"} baseColor="#ddd" highlightColor="#bbb">
        <div className="bg-white px-4 py-2 rounded-md">
          <p>
            <Skeleton count={1} width={"60%"} />
          </p>
          <p>
            <Skeleton count={1} width={"30%"} />
          </p>
          <p>
            <Skeleton count={2} width={"100%"} />
          </p>
        </div>
      </SkeletonTheme>
      <div className="p-2"></div>
      <SkeletonTheme borderRadius={"50"} baseColor="#ccc" highlightColor="#AAA">
        <div className="bg-white px-4 py-2 rounded-md">
          <p>
            <Skeleton count={1} width={"60%"} />
          </p>
          <p>
            <Skeleton count={1} width={"30%"} />
          </p>
          <p>
            <Skeleton count={2} width={"100%"} />
          </p>
        </div>
      </SkeletonTheme>
      <div className="p-2"></div>
      <SkeletonTheme borderRadius={"50"} baseColor="#ccc" highlightColor="#AAA">
        <div className="bg-white px-4 py-2 rounded-md">
          <p>
            <Skeleton count={1} width={"60%"} />
          </p>
          <p>
            <Skeleton count={1} width={"30%"} />
          </p>
          <p>
            <Skeleton count={2} width={"100%"} />
          </p>
        </div>
      </SkeletonTheme>
      <div className="p-2"></div>
      <SkeletonTheme borderRadius={"50"} baseColor="#ccc" highlightColor="#AAA">
        <div className="bg-white px-4 py-2 rounded-md">
          <p>
            <Skeleton count={1} width={"60%"} />
          </p>
          <p>
            <Skeleton count={1} width={"30%"} />
          </p>
          <p>
            <Skeleton count={2} width={"100%"} />
          </p>
        </div>
      </SkeletonTheme>
      <div className="p-2"></div>
      <SkeletonTheme borderRadius={"50"} baseColor="#ccc" highlightColor="#AAA">
        <div className="bg-white px-4 py-2 rounded-md">
          <p>
            <Skeleton count={1} width={"60%"} />
          </p>
          <p>
            <Skeleton count={1} width={"30%"} />
          </p>
          <p>
            <Skeleton count={2} width={"100%"} />
          </p>
        </div>
      </SkeletonTheme>
    </div>
  );
}

export default Skelton;
