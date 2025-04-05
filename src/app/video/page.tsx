export default function Page() {
    return (
        <video controls width={500}>
            <source src={"/video_demonstration.mp4"} type="video/mp4" />
        </video>
    );
}