import React, { useMemo, useState } from "react";
import {
  SafeAreaView, View, Text, StyleSheet, ScrollView, Pressable,
  TextInput, StatusBar, Modal, Alert
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

type Transaction = {
  id: string; merchant: string; category: string; date: string;
  amount: number; icon: keyof typeof Ionicons.glyphMap; color: string;
  location: string; status: "Settled" | "Pending";
};

const initialTransactions: Transaction[] = [
  { id: "1", merchant: "Keells Super", category: "Groceries", date: "Today · 2:30 PM", amount: 2850, icon: "cart-outline", color: "#62E6C6", location: "Example location · Colombo", status: "Settled" },
  { id: "2", merchant: "Coffee House", category: "Food & drink", date: "Today · 10:15 AM", amount: 650, icon: "cafe-outline", color: "#FFC46B", location: "Example location · Colombo", status: "Settled" },
  { id: "3", merchant: "PickMe Ride", category: "Transport", date: "Yesterday · 6:40 PM", amount: 920, icon: "car-outline", color: "#8CB8FF", location: "Location unavailable in demo", status: "Settled" },
  { id: "4", merchant: "Fashion Store", category: "Shopping", date: "Yesterday · 1:20 PM", amount: 4200, icon: "shirt-outline", color: "#C6A4FF", location: "Example location · Colombo", status: "Pending" },
  { id: "5", merchant: "Cargills Food City", category: "Groceries", date: "Oct 15 · 5:05 PM", amount: 1760, icon: "basket-outline", color: "#62E6C6", location: "Example location · Colombo", status: "Settled" },
];

const money = (n: number) => "Rs. " + Math.round(n).toLocaleString("en-LK");
type Tab = "Home" | "Activity" | "Insights" | "Profile";

export default function App() {
  const [tab, setTab] = useState<Tab>("Home");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Shopping");
  const [budget, setBudget] = useState("25000");
  const [bankConnected, setBankConnected] = useState(false);

  const todaySpend = transactions.filter(t => t.date.startsWith("Today")).reduce((s, t) => s + t.amount, 0);
  const monthSpend = transactions.reduce((s, t) => s + t.amount, 0);
  const filtered = useMemo(() => transactions.filter(t =>
    (t.merchant + " " + t.category).toLowerCase().includes(query.toLowerCase())
  ), [transactions, query]);

  const addTransaction = () => {
    const parsed = Number(amount.replace(/,/g, ""));
    if (!merchant.trim() || !Number.isFinite(parsed) || parsed <= 0) {
      Alert.alert("Check the details", "Enter a merchant name and a valid amount.");
      return;
    }
    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
      Shopping: "bag-outline", Groceries: "cart-outline", Transport: "car-outline",
      "Food & drink": "cafe-outline", Bills: "receipt-outline", Other: "wallet-outline"
    };
    const item: Transaction = {
      id: Date.now().toString(), merchant: merchant.trim(), category, date: "Today · Just now",
      amount: parsed, icon: icons[category] || "wallet-outline", color: "#62E6C6",
      location: "Not provided", status: "Settled"
    };
    setTransactions(prev => [item, ...prev]);
    setMerchant(""); setAmount(""); setShowAdd(false); setTab("Activity");
  };

  const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.logo}><Ionicons name="pulse" size={22} color="#071321" /></View>
        <Text style={styles.brand}>TAP<Text style={{ color: "#62E6C6" }}>TRACE</Text></Text>
      </View>
      <View style={styles.headerTitleRow}>
        <View><Text style={styles.pageTitle}>{title}</Text>{subtitle ? <Text style={styles.subTitle}>{subtitle}</Text> : null}</View>
        <Pressable style={styles.bell} onPress={() => Alert.alert("You're all caught up", "Notifications will appear here.")}>
          <Ionicons name="notifications-outline" size={21} color="#E9F2FF" />
        </Pressable>
      </View>
    </View>
  );

  const TransactionRow = ({ item }: { item: Transaction }) => (
    <Pressable style={styles.transactionRow} onPress={() => setSelected(item)}>
      <View style={[styles.txIcon, { backgroundColor: item.color + "1D" }]}>
        <Ionicons name={item.icon} size={22} color={item.color} />
      </View>
      <View style={styles.txMain}>
        <Text style={styles.txMerchant}>{item.merchant}</Text>
        <Text style={styles.txMeta}>{item.category} · {item.date}</Text>
      </View>
      <View style={styles.txAmountCol}>
        <Text style={styles.txAmount}>−{money(item.amount)}</Text>
        {item.status === "Pending" ? <Text style={styles.pending}>Pending</Text> : <Text style={styles.settled}>Settled</Text>}
      </View>
    </Pressable>
  );

  const renderHome = () => (
    <>
      <Header title="Your money, clearer." subtitle="A simple view of your spending" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.demoBanner}>
          <Ionicons name="information-circle-outline" size={17} color="#FFC46B" />
          <Text style={styles.demoText}>DEMO MODE · Sample transactions, not live bank data</Text>
        </View>
        <View style={styles.balanceCard}>
          <View style={styles.cardTop}>
            <View><Text style={styles.cardLabel}>TOTAL TRACKED SPENDING</Text><Text style={styles.bigAmount}>{money(monthSpend)}</Text></View>
            <View style={styles.cardChip}><Ionicons name="analytics-outline" size={23} color="#62E6C6" /></View>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardBottom}>
            <View><Text style={styles.smallLabel}>TODAY</Text><Text style={styles.cardStat}>{money(todaySpend)}</Text></View>
            <View><Text style={styles.smallLabel}>TRANSACTIONS</Text><Text style={styles.cardStat}>{transactions.length}</Text></View>
            <View><Text style={styles.smallLabel}>CURRENCY</Text><Text style={styles.cardStat}>LKR</Text></View>
          </View>
          <View style={styles.glowOne} /><View style={styles.glowTwo} />
        </View>
        <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Quick actions</Text></View>
        <View style={styles.quickActions}>
          <Pressable style={styles.quickAction} onPress={() => setShowAdd(true)}>
            <View style={[styles.quickIcon, { backgroundColor: "#62E6C61C" }]}><Ionicons name="add" size={23} color="#62E6C6" /></View>
            <Text style={styles.quickText}>Add expense</Text>
          </Pressable>
          <Pressable style={styles.quickAction} onPress={() => setTab("Insights")}>
            <View style={[styles.quickIcon, { backgroundColor: "#8CB8FF1C" }]}><Ionicons name="pie-chart-outline" size={22} color="#8CB8FF" /></View>
            <Text style={styles.quickText}>View insights</Text>
          </Pressable>
          <Pressable style={styles.quickAction} onPress={() => setTab("Profile")}>
            <View style={[styles.quickIcon, { backgroundColor: "#C6A4FF1C" }]}><Ionicons name="card-outline" size={22} color="#C6A4FF" /></View>
            <Text style={styles.quickText}>Connect bank</Text>
          </Pressable>
        </View>
        <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Recent activity</Text><Pressable onPress={() => setTab("Activity")}><Text style={styles.seeAll}>See all</Text></Pressable></View>
        <View style={styles.panel}>{transactions.slice(0, 4).map(item => <TransactionRow key={item.id} item={item} />)}</View>
        <Text style={styles.footerNote}>TAPTRACE helps you track spending. It is not a bank and does not move money.</Text>
      </ScrollView>
    </>
  );

  const renderActivity = () => (
    <>
      <Header title="Activity" subtitle="Every tracked transaction in one place" />
      <View style={styles.searchWrap}><Ionicons name="search-outline" size={19} color="#8091A8" /><TextInput value={query} onChangeText={setQuery} placeholder="Search merchant or category" placeholderTextColor="#718096" style={styles.searchInput} /></View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.listSummary}><Text style={styles.muted}>{filtered.length} transactions</Text><Pressable onPress={() => setShowAdd(true)}><Text style={styles.seeAll}>+ Add expense</Text></Pressable></View>
        <View style={styles.panel}>{filtered.map(item => <TransactionRow key={item.id} item={item} />)}{filtered.length === 0 && <Text style={styles.empty}>No transactions match your search.</Text>}</View>
      </ScrollView>
    </>
  );

  const renderInsights = () => {
    const totals: Record<string, number> = {};
    transactions.forEach(t => totals[t.category] = (totals[t.category] || 0) + t.amount);
    const max = Math.max(...Object.values(totals), 1);
    const budgetNum = Math.max(Number(budget) || 25000, 1);
    return <>
      <Header title="Insights" subtitle="Understand where your money goes" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.panelPadded}>
          <Text style={styles.sectionTitle}>Tracked spending</Text><Text style={styles.insightTotal}>{money(monthSpend)}</Text>
          <Text style={styles.muted}>Across {transactions.length} recorded transactions</Text>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.min(monthSpend / budgetNum * 100, 100)}%` as any }]} /></View>
          <View style={styles.rowBetween}><Text style={styles.muted}>Monthly budget</Text><Text style={styles.white}>{money(budgetNum)}</Text></View>
          <View style={styles.rowBetween}><Text style={styles.muted}>Budget used</Text><Text style={styles.mint}>{Math.round(monthSpend / budgetNum * 100)}%</Text></View>
          {monthSpend > budgetNum ? <Text style={styles.warningText}>You've passed this demo budget. Consider reviewing your spending.</Text> : null}
        </View>
        <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>By category</Text></View>
        <View style={styles.panelPadded}>
          {Object.entries(totals).sort((a,b) => b[1]-a[1]).map(([name, total]) => (
            <View key={name} style={styles.categoryItem}>
              <View style={styles.rowBetween}><Text style={styles.txMerchant}>{name}</Text><Text style={styles.txAmount}>{money(total)}</Text></View>
              <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${total/max*100}%` as any }]} /></View>
            </View>
          ))}
        </View>
        <View style={styles.panelPadded}><Text style={styles.sectionTitle}>Set monthly budget</Text><TextInput value={budget} onChangeText={setBudget} keyboardType="numeric" style={styles.input} placeholder="e.g. 25000" placeholderTextColor="#718096" /><Text style={styles.muted}>This budget is saved for this app session only.</Text></View>
      </ScrollView>
    </>;
  };

  const renderProfile = () => (
    <>
      <Header title="Connections" subtitle="Manage your bank and app preferences" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.bankCard}>
          <View style={styles.bankIcon}><Ionicons name="business-outline" size={25} color="#62E6C6" /></View>
          <View style={{ flex: 1 }}><Text style={styles.txMerchant}>Bank of Ceylon</Text><Text style={styles.txMeta}>BOC · Sri Lanka</Text></View>
          <View style={styles.demoPill}><Text style={styles.demoPillText}>{bankConnected ? "DEMO" : "NOT CONNECTED"}</Text></View>
        </View>
        <View style={styles.panelPadded}>
          <Text style={styles.sectionTitle}>Bank connection</Text>
          <Text style={styles.bodyText}>Live BOC transaction access has not been verified for this prototype. The connect button below demonstrates the flow only; it does not contact BOC or link a real account.</Text>
          <Pressable style={styles.primaryButton} onPress={() => Alert.alert("BOC connection not available", "This is a demo only. No bank login is requested and no real account is connected. Live access requires an authorized BOC API or approved provider.")}>
            <Ionicons name="shield-checkmark-outline" size={19} color="#071321" /><Text style={styles.primaryButtonText}>Connect BOC securely</Text>
          </Pressable>
          <View style={styles.securityNote}><Ionicons name="lock-closed-outline" size={18} color="#62E6C6" /><Text style={styles.securityText}>Never enter your ATM PIN, CVV, or bank password into TAPTRACE.</Text></View>
        </View>
        <View style={styles.panelPadded}>
          <Text style={styles.sectionTitle}>About TAPTRACE</Text>
          <View style={styles.rowBetween}><Text style={styles.muted}>Version</Text><Text style={styles.white}>0.1.0 Prototype</Text></View>
          <View style={styles.rowBetween}><Text style={styles.muted}>Region</Text><Text style={styles.white}>Sri Lanka</Text></View>
          <View style={styles.rowBetween}><Text style={styles.muted}>Currency</Text><Text style={styles.white}>LKR (Rs.)</Text></View>
        </View>
      </ScrollView>
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="light" />
      <StatusBar barStyle="light-content" backgroundColor="#08111F" />
      <View style={styles.app}>
        {tab === "Home" ? renderHome() : tab === "Activity" ? renderActivity() : tab === "Insights" ? renderInsights() : renderProfile()}
        <View style={styles.tabBar}>
          {([
            ["Home", "home-outline", "Home"],
            ["Activity", "receipt-outline", "Activity"],
            ["Insights", "pie-chart-outline", "Insights"],
            ["Profile", "person-circle-outline", "Profile"]
          ] as const).map(([label, icon, key]) => (
            <Pressable key={key} style={styles.tabItem} onPress={() => setTab(key)}>
              <Ionicons name={icon} size={22} color={tab === key ? "#62E6C6" : "#718096"} />
              <Text style={[styles.tabLabel, tab === key && styles.tabLabelActive]}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Modal visible={showAdd} transparent animationType="slide" onRequestClose={() => setShowAdd(false)}>
        <View style={styles.modalBackdrop}><View style={styles.modalCard}>
          <View style={styles.rowBetween}><Text style={styles.modalTitle}>Add an expense</Text><Pressable onPress={() => setShowAdd(false)}><Ionicons name="close" size={24} color="#E9F2FF" /></Pressable></View>
          <Text style={styles.inputLabel}>Merchant</Text><TextInput value={merchant} onChangeText={setMerchant} style={styles.input} placeholder="e.g. Grocery shop" placeholderTextColor="#718096" />
          <Text style={styles.inputLabel}>Amount (LKR)</Text><TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" style={styles.input} placeholder="e.g. 1250" placeholderTextColor="#718096" />
          <Text style={styles.inputLabel}>Category</Text>
          <View style={styles.categoryChoices}>{["Shopping", "Groceries", "Transport", "Food & drink", "Bills", "Other"].map(c => <Pressable key={c} onPress={() => setCategory(c)} style={[styles.categoryChoice, category === c && styles.categoryChoiceSelected]}><Text style={[styles.categoryChoiceText, category === c && styles.categoryChoiceTextSelected]}>{c}</Text></Pressable>)}</View>
          <Pressable style={styles.primaryButton} onPress={addTransaction}><Text style={styles.primaryButtonText}>Save expense</Text></Pressable>
        </View></View>
      </Modal>

      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalBackdrop}><View style={styles.modalCard}>
          <View style={styles.rowBetween}><Text style={styles.modalTitle}>Transaction details</Text><Pressable onPress={() => setSelected(null)}><Ionicons name="close" size={24} color="#E9F2FF" /></Pressable></View>
          {selected && <>
            <Text style={styles.detailAmount}>−{money(selected.amount)}</Text><Text style={styles.detailMerchant}>{selected.merchant}</Text>
            <View style={styles.detailLine}><Text style={styles.muted}>Category</Text><Text style={styles.white}>{selected.category}</Text></View>
            <View style={styles.detailLine}><Text style={styles.muted}>Date</Text><Text style={styles.white}>{selected.date}</Text></View>
            <View style={styles.detailLine}><Text style={styles.muted}>Status</Text><Text style={selected.status === "Pending" ? styles.pending : styles.settled}>{selected.status}</Text></View>
            <View style={styles.detailLine}><Text style={styles.muted}>Location</Text><Text style={styles.white}>{selected.location}</Text></View>
            <Text style={styles.muted}>Merchant locations are examples in demo mode, not verified GPS data.</Text>
            <Pressable style={styles.secondaryButton} onPress={() => { setTransactions(prev => prev.filter(t => t.id !== selected.id)); setSelected(null); }}><Text style={styles.secondaryButtonText}>Delete this demo entry</Text></Pressable>
          </>}
        </View></View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#08111F" },
  app: { flex: 1, backgroundColor: "#08111F" },
  header: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 16 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 24 },
  logo: { width: 32, height: 32, borderRadius: 11, backgroundColor: "#62E6C6", alignItems: "center", justifyContent: "center" },
  brand: { color: "#F3F7FC", fontSize: 17, fontWeight: "900", letterSpacing: 1.6 },
  headerTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  pageTitle: { color: "#F3F7FC", fontSize: 25, fontWeight: "800", letterSpacing: -0.5 },
  subTitle: { color: "#8A9AB0", fontSize: 12, marginTop: 5 },
  bell: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#152236", alignItems: "center", justifyContent: "center" },
  content: { paddingHorizontal: 20, paddingBottom: 24, gap: 16 },
  demoBanner: { backgroundColor: "#3B2D18", borderColor: "#6E5125", borderWidth: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 8 },
  demoText: { color: "#FFD38B", fontSize: 10, fontWeight: "800", letterSpacing: 0.4, flex: 1 },
  balanceCard: { backgroundColor: "#132B3B", borderRadius: 24, padding: 21, overflow: "hidden", borderWidth: 1, borderColor: "#254B57" },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  cardLabel: { color: "#9DB7C4", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  bigAmount: { color: "#F5FBFF", fontSize: 32, fontWeight: "800", marginTop: 8, letterSpacing: -0.8 },
  cardChip: { width: 43, height: 43, borderRadius: 14, backgroundColor: "#62E6C61C", alignItems: "center", justifyContent: "center" },
  cardDivider: { height: 1, backgroundColor: "#FFFFFF20", marginVertical: 20 },
  cardBottom: { flexDirection: "row", justifyContent: "space-between" },
  smallLabel: { color: "#9DB7C4", fontSize: 9, fontWeight: "800", letterSpacing: 0.7 },
  cardStat: { color: "#F5FBFF", fontSize: 15, fontWeight: "700", marginTop: 7 },
  glowOne: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "#62E6C609", right: -80, top: 10 },
  glowTwo: { position: "absolute", width: 120, height: 120, borderRadius: 60, backgroundColor: "#8CB8FF09", right: 40, bottom: -80 },
  sectionHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  sectionTitle: { color: "#EDF4FC", fontSize: 16, fontWeight: "800" },
  seeAll: { color: "#62E6C6", fontSize: 12, fontWeight: "700" },
  quickActions: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  quickAction: { flex: 1, alignItems: "center", backgroundColor: "#101C2D", borderWidth: 1, borderColor: "#1D2C40", paddingVertical: 15, borderRadius: 17 },
  quickIcon: { width: 43, height: 43, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 9 },
  quickText: { color: "#DCE7F5", fontSize: 10, fontWeight: "700" },
  panel: { backgroundColor: "#101C2D", borderWidth: 1, borderColor: "#1D2C40", borderRadius: 18, paddingHorizontal: 14 },
  transactionRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#FFFFFF0B", gap: 11 },
  txIcon: { width: 43, height: 43, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  txMain: { flex: 1 },
  txMerchant: { color: "#F1F6FD", fontSize: 13, fontWeight: "700" },
  txMeta: { color: "#8292A9", fontSize: 10, marginTop: 5 },
  txAmountCol: { alignItems: "flex-end" },
  txAmount: { color: "#F1F6FD", fontSize: 12, fontWeight: "800" },
  settled: { color: "#62E6C6", fontSize: 10, marginTop: 5 },
  pending: { color: "#FFC46B", fontSize: 10, marginTop: 5 },
  footerNote: { color: "#6F8096", fontSize: 10, lineHeight: 16, textAlign: "center", paddingHorizontal: 14, paddingBottom: 4 },
  tabBar: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#1B2A3D", backgroundColor: "#0B1625", paddingTop: 10, paddingBottom: 8 },
  tabItem: { flex: 1, alignItems: "center", gap: 5 },
  tabLabel: { color: "#718096", fontSize: 10, fontWeight: "600" },
  tabLabelActive: { color: "#62E6C6", fontWeight: "800" },
  searchWrap: { marginHorizontal: 20, marginBottom: 15, paddingHorizontal: 13, height: 48, backgroundColor: "#101C2D", borderColor: "#24334A", borderWidth: 1, borderRadius: 14, flexDirection: "row", alignItems: "center", gap: 9 },
  searchInput: { color: "#F3F7FC", flex: 1, fontSize: 13 },
  listSummary: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  muted: { color: "#8292A9", fontSize: 11 },
  empty: { color: "#8292A9", padding: 20, textAlign: "center" },
  panelPadded: { backgroundColor: "#101C2D", borderWidth: 1, borderColor: "#1D2C40", borderRadius: 18, padding: 17, gap: 13 },
  insightTotal: { color: "#F5FBFF", fontSize: 30, fontWeight: "800", marginTop: 7 },
  progressTrack: { height: 7, backgroundColor: "#26354A", borderRadius: 9, overflow: "hidden", marginTop: 7, marginBottom: 5 },
  progressFill: { height: 7, backgroundColor: "#62E6C6", borderRadius: 9 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  white: { color: "#EAF2FB", fontSize: 12, fontWeight: "600" },
  mint: { color: "#62E6C6", fontSize: 12, fontWeight: "800" },
  categoryItem: { gap: 2, marginTop: 5 },
  warningText: { color: "#FFC46B", fontSize: 11, lineHeight: 16 },
  bankCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#101C2D", borderWidth: 1, borderColor: "#1D2C40", borderRadius: 18, padding: 16 },
  bankIcon: { width: 47, height: 47, borderRadius: 15, backgroundColor: "#62E6C61C", alignItems: "center", justifyContent: "center" },
  demoPill: { backgroundColor: "#3B2D18", paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8 },
  demoPillText: { color: "#FFD38B", fontSize: 8, fontWeight: "900" },
  bodyText: { color: "#A3B1C4", fontSize: 12, lineHeight: 19 },
  primaryButton: { backgroundColor: "#62E6C6", borderRadius: 13, paddingVertical: 14, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, marginTop: 4 },
  primaryButtonText: { color: "#071321", fontSize: 13, fontWeight: "900" },
  securityNote: { flexDirection: "row", alignItems: "flex-start", gap: 9, backgroundColor: "#62E6C610", borderRadius: 12, padding: 12 },
  securityText: { color: "#B5C6D6", flex: 1, fontSize: 11, lineHeight: 17 },
  modalBackdrop: { flex: 1, backgroundColor: "#000000B8", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#101C2D", borderTopLeftRadius: 25, borderTopRightRadius: 25, borderWidth: 1, borderColor: "#293B53", padding: 22, paddingBottom: 32, gap: 13 },
  modalTitle: { color: "#F3F7FC", fontSize: 20, fontWeight: "800" },
  inputLabel: { color: "#A7B6C9", fontSize: 11, fontWeight: "700", marginTop: 2 },
  input: { color: "#F3F7FC", backgroundColor: "#0B1625", borderColor: "#293B53", borderWidth: 1, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 12, fontSize: 13 },
  categoryChoices: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryChoice: { paddingHorizontal: 11, paddingVertical: 9, borderRadius: 10, borderWidth: 1, borderColor: "#2A3A50", backgroundColor: "#0B1625" },
  categoryChoiceSelected: { borderColor: "#62E6C6", backgroundColor: "#62E6C61A" },
  categoryChoiceText: { color: "#A7B6C9", fontSize: 11 },
  categoryChoiceTextSelected: { color: "#62E6C6", fontWeight: "800" },
  secondaryButton: { borderWidth: 1, borderColor: "#75434B", borderRadius: 12, padding: 13, alignItems: "center", marginTop: 5 },
  secondaryButtonText: { color: "#FF9AA7", fontSize: 12, fontWeight: "700" },
  detailAmount: { color: "#62E6C6", fontSize: 30, fontWeight: "900", textAlign: "center", marginTop: 8 },
  detailMerchant: { color: "#F3F7FC", fontSize: 16, fontWeight: "800", textAlign: "center", marginBottom: 8 },
  detailLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#FFFFFF0B" }
});