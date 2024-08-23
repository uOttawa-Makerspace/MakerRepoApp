type PrinterIssue = {
    printer_id: number;
    summary: string;
    description: string;
    reporter: string; // Just take the reporter name
    created_at: string;
}



const PrinterIssues: React.FC = () => {
return (
    <table className="table">
        <thead>
            <tr>
                <td>Printer</td>
                <td>Summary</td>
                <td>Created at</td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Huh</td>
                <td>Huh</td>
                <td>Huh</td>
            </tr>
        </tbody>
    </table>
)
}

export default PrinterIssues;
