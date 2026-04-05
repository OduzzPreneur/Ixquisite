import { AccountShell } from "@/components/page-templates";

export default function AccountProfilePage() {
  return (
    <AccountShell title="Profile details" copy="Name, email, phone, password, and communication preferences belong in one practical surface.">
      <div className="form-grid">
        <div className="field"><label>Full name</label><input defaultValue="Client Name" /></div>
        <div className="field"><label>Email</label><input defaultValue="client@example.com" /></div>
        <div className="field"><label>Phone</label><input defaultValue="+234 800 000 0000" /></div>
        <div className="field"><label>Password</label><input type="password" defaultValue="password" /></div>
      </div>
    </AccountShell>
  );
}
