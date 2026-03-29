import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";

actor self {
  type UserId = Principal;
  type Instrument = Text;
  type Side = { #buy; #sell };
  type Timestamp = Nat;
  type Balance = Nat;
  type Amount = Nat;
  type Price = Nat;
  type TradeAmount = Nat;

  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module Timestamp {
    public func toText(ts : Timestamp) : Text {
      ts.toText();
    };
  };
  module Balance {
    public func toText(b : Balance) : Text {
      b.toText();
    };
  };
  module Amount {
    public func toText(a : Amount) : Text {
      a.toText();
    };
  };
  module Price {
    public func toText(p : Price) : Text {
      p.toText();
    };
  };
  module TradeAmount {
    public func toText(ta : TradeAmount) : Text {
      ta.toText();
    };
  };

  // Model types
  type Portfolio = Map.Map<Instrument, Amount>;
  type Trade = { instrument : Instrument; price : Price; timestamp : Timestamp; tradeAmount : TradeAmount };
  type User = { balance : Balance; portfolio : Portfolio; trades : List.List<Trade> };

  module Instrument {
    public func toText(i : Instrument) : Text {
      i;
    };
  };

  type OrderBook = List.List<(Instrument, Price)>;
  type Asset = {
    id : Instrument;
    currentPrice : Price;
    openingPrice : Price;
  };

  module Asset {
    public func compare(asset1 : Asset, asset2 : Asset) : { #less; #equal; #greater } {
      Text.compare(asset1.id, asset2.id);
    };
  };

  // User profile type as required by frontend
  public type UserProfile = {
    name : Text;
  };

  // Persistent state
  let users = Map.empty<UserId, User>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let priceBook : Map.Map<Instrument, Asset> = Map.empty();

  // Transaction history
  let trades = List.empty<Trade>();

  // Fixed assets
  let fixedAssets : [Asset] = [
    { id = "BTC"; currentPrice = 50000; openingPrice = 50000 },
    { id = "ETH"; currentPrice = 3500; openingPrice = 3500 },
    { id = "SOL"; currentPrice = 100; openingPrice = 100 },
    { id = "DOGE"; currentPrice = 0 ; openingPrice = 0 },
    { id = "LINK"; currentPrice = 25; openingPrice = 25 },
    { id = "ADA"; currentPrice = 1; openingPrice = 1 },
  ];

  // Initialize priceBook
  fixedAssets.forEach(func(asset) { priceBook.add(asset.id, asset) });

  // User profile management functions (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user: Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Deposit function
  public shared ({ caller }) func deposit(amount : Balance) : async Balance {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can deposit funds");
    };

    switch (users.get(caller)) {
      case (?user) {
        let newBalance = user.balance + amount;
        let updatedUser : User = {
          user with balance = newBalance;
        };
        users.add(caller, updatedUser);
        newBalance;
      };
      case (null) { Runtime.trap("Deposit failed: User not found") };
    };
  };

  // Buy function with validation
  public shared ({ caller }) func buy(instrument : Instrument, amount : Amount) : async Balance {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can buy assets");
    };

    switch (users.get(caller)) {
      case (?user) {
        switch (priceBook.containsKey(instrument)) {
          case (false) { Runtime.trap("Instrument not found") };
          case (true) {
            let price = await self.getPrice(instrument);
            let cost = price * amount;
            if (user.balance < cost) {
              Runtime.trap("Insufficient balance");
            };
            if (cost == 0) { Runtime.trap("Cannot purchase zero amount") };
            // Process new balance and portfolio entry
            let newBalance = user.balance - cost;
            let userHoldings = switch (user.portfolio.get(instrument)) {
              case (?instrumentAmount) { instrumentAmount };
              case (null) { 0 };
            };
            let newHoldings = userHoldings + amount;
            let newPortfolio = user.portfolio.clone();
            newPortfolio.add(instrument, newHoldings);
            // Immediate trade execution with current timestamp
            let newTrade : Trade = { instrument; price; timestamp = getCurrentTimestamp(); tradeAmount = cost };
            user.trades.add(newTrade);
            trades.add(newTrade);
            // Balance update and store new user state
            let updatedUser : User = {
              user with balance = newBalance;
              portfolio = newPortfolio;
            };
            users.add(caller, updatedUser);
            newBalance;
          };
        };
      };
      case (null) { Runtime.trap("User not found") };
    };
  };

  // Sell function with validation
  public shared ({ caller }) func sell(instrument : Instrument, amount : Amount) : async Balance {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can sell assets");
    };

    switch (users.get(caller)) {
      case (?user) {
        let price = await self.getPrice(instrument);
        let saleProceeds = price * amount;
        let currentHoldings = switch (user.portfolio.get(instrument)) {
          case (?holdings) { holdings };
          case (null) { Runtime.trap("Instrument holdings not found") };
        };
        if (amount > currentHoldings) {
          Runtime.trap("Insufficient holdings to sell");
        };

        let newBalance = user.balance + saleProceeds;
        let remainingHoldings = currentHoldings - amount;
        let newPortfolio = user.portfolio.clone();
        if (remainingHoldings == 0) {
          newPortfolio.remove(instrument);
        } else {
          newPortfolio.add(instrument, remainingHoldings);
        };
        // Immediate trade execution with current timestamp
        let newTrade : Trade = { instrument; price; timestamp = getCurrentTimestamp(); tradeAmount = saleProceeds };

        user.trades.add(newTrade);
        trades.add(newTrade);

        // Balance update and store new user state
        let updatedUser : User = {
          user with balance = newBalance;
          portfolio = newPortfolio;
        };
        users.add(caller, updatedUser);
        newBalance;
      };
      case (null) { Runtime.trap("User not found") };
    };
  };

  // Create user - allows guests to register (no auth check)
  public shared ({ caller }) func createUser() : async () {
    if (users.containsKey(caller)) { Runtime.trap("User already exists") };
    let user : User = {
      balance = 10_000;
      portfolio = Map.empty<Text, Amount>();
      trades = List.empty<Trade>();
    };
    users.add(caller, user);
  };

  // Get caller's balance - requires user permission
  public query ({ caller }) func getCallerBalance() : async Balance {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view balance");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User is not registered") };
      case (?user) { user.balance };
    };
  };

  // Get caller's portfolio - requires user permission
  public query ({ caller }) func getCallersInvestmentPortfolio() : async [(Instrument, Amount)] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view portfolio");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (?user) { user.portfolio.toArray() };
    };
  };

  // Public price query - no auth needed
  public shared ({ caller }) func getPrice(assetId : Text) : async Price {
    if (assetId == "DOGE") { return 0 };
    if (assetId == "ADA") { return 1 };
    if (assetId == "LINK") { return 25 };
    if (assetId == "SOL") { return 100 };
    if (assetId == "ETH") { return 3500 };
    50000;
  };

  // Get trade history - requires user permission
  public query ({ caller }) func getTradeHistory() : async [Trade] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view trade history");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (?user) { user.trades.toArray() };
    };
  };

  // Get all asset prices - public data, no auth needed
  public query func getAllCurrentAssetPrices() : async [Asset] {
    priceBook.values().toArray().sort();
  };

  func getCurrentTimestamp() : Timestamp { 0 };
};
