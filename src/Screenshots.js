// import "./styles.css";

export default function Screenshots({ content }) {
  console.log("another image ??");
  const listItems = content.map((src, index) => (
    <image key={index} src={src} />
  ));
  return <div>{listItems}</div>;
}
