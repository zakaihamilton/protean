import Group from "src/UI/Widgets/Group";
import Window from "src/UI/Window";

export default function ListEditor() {
    return <>
        <Window.Region left={100} top={100} width={500} height={500} />
        <Window label="List Editor" maximize accentBackground="darkgreen">
            <Group>
            </Group>
        </Window>
    </>;
}
