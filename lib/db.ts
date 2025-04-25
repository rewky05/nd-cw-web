// This file provides access to the database data
// In a real application, this would be replaced with actual database queries

// Import the database JSON
export const db = {
  Branches: {
    "branch-1": {
      AddOns: {
        "Armour All": {
          estimatedTime: 1,
          name: "Armour All",
          price: 100,
        },
        "Under Chassis": {
          estimatedTime: 1,
          name: "Under Chassis",
          price: 100,
        },
      },
      profile: {
        address: "Branch 2, Mandaue City",
        contact_number: "+63 912 987 6543",
        latitude: 10.296187131102688,
        longitude: 123.85384176356067,
        name: "Bacolod",
        schedule: "Mon-Sat: 9:00 AM - 6:00 PM",
      },
      Bays: {
        Bay1: true,
        Bay2: true,
        Bay3: true,
      },
      Services: {
        "Body Wash": {
          estimatedTime: 2,
          name: "Body Wash",
          pickupPrice: 300,
          sedanPrice: 100,
          suvPrice: 200,
        },
        "Value Wash": {
          estimatedTime: 2,
          name: "Value Wash",
          pickupPrice: 220,
          sedanPrice: 120,
          suvPrice: 320,
        },
      },
    },
    "branch-2": {
      AddOns: {
        "Armour All": {
          estimatedTime: 1,
          name: "Armour All",
          price: 100,
        },
        "Under Chassis": {
          estimatedTime: 1,
          name: "Under Chassis",
          price: 200,
        },
      },
      profile: {
        address: "Branch 1, Cebu City",
        contact_number: "+63 912 345 6789",
        latitude: 10.295300420085066,
        longitude: 123.86439893782935,
        name: "P. Mabolo",
        schedule: "Mon-Fri: 8:00 AM - 5:00 PM",
      },
      Services: {
        "Body Wash": {
          estimatedTime: 2,
          name: "Body Wash",
          pickupPrice: 270,
          sedanPrice: 180,
          suvPrice: 220,
        },
        "Value Wash": {
          estimatedTime: 2,
          name: "Value Wash",
          pickupPrice: 250,
          sedanPrice: 150,
          suvPrice: 200,
        },
      },
    },
    "branch-3": {
      AddOns: {
        "Armour All": {
          estimatedTime: 1,
          name: "Armour All",
          price: 120,
        },
        "Under Chassis": {
          estimatedTime: 1,
          name: "Under Chassis",
          price: 140,
        },
      },
      profile: {
        address: "Branch 3, Talisay City",
        contact_number: "+63 912 555 1234",
        latitude: 10.303322952804074,
        longitude: 123.86572931344857,
        name: "Urgello",
        schedule: "Mon-Sun: 7:00 AM - 8:00 PM",
      },
      Bays: {
        Bay1: {
          status: "unavailable",
        },
        Bay2: {
          status: "unavailable",
        },
        Bay3: {
          status: "available",
        },
        Bay4: {
          status: "available",
        },
      },
      Reservations: {
        Bays: {
          Bay3: {
            status: "available",
          },
          Bay4: {
            status: "available",
          },
        },
      },
      Services: {
        "Body Wash": {
          estimatedTime: 2,
          name: "Body Wash",
          pickupPrice: 230,
          sedanPrice: 130,
          suvPrice: 330,
        },
        "Value Wash": {
          estimatedTime: 2,
          name: "Value Wash",
          pickupPrice: 240,
          sedanPrice: 140,
          suvPrice: 340,
        },
      },
    },
  },
  Calendar: {
    "branch-3": {
      "2024-12-07": {
        "ND-366138": {
          appointmentId: "ND-366138",
          bayNumber: "Bay4",
          estCompletion: "3",
          plateNumber: "JJ6865",
          timeSlot: "9",
          userId: "123",
          vehicleClassification: "Motorcycle (Large)",
        },
        "ND-834432": {
          appointmentId: "ND-834432",
          bayNumber: "Bay3",
          estCompletion: "3",
          plateNumber: "JJ6865",
          timeSlot: "8",
          userId: "123",
          vehicleClassification: "Motorcycle (Large)",
        },
      },
      "2024-12-08": {
        "-ODaz2KZ9twQkpTb9jBp": {
          appointmentId: "",
          bayNumber: "hf",
          estCompletion: "8",
          plateNumber: "bf",
          timeSlot: "8",
          userId: "",
          vehicleClassification: "",
        },
      },
      "2024-12-10": {
        "-ODgVwRF2a0exRCqxasJ": {
          appointmentId: "",
          bayNumber: "Bay - 1",
          estCompletion: "3",
          plateNumber: "NDRT 123",
          timeSlot: "8",
          userId: "",
          vehicleClassification: "",
        },
        "ND-362194": {
          appointmentId: "ND-362194",
          bayNumber: "Bay4",
          estCompletion: "3",
          plateNumber: "GAC231",
          timeSlot: "9",
          userId: "123",
          vehicleClassification: "Pick Up",
        },
        "ND-949278": {
          appointmentId: "ND-949278",
          bayNumber: "Bay3",
          estCompletion: "3",
          plateNumber: "12345",
          timeSlot: "6",
          userId: "123",
          vehicleClassification: "Sedan",
        },
      },
      "2024-12-12": {
        "ND-103437": {
          appointmentId: "ND-103437",
          bayNumber: "Bay3",
          estCompletion: "3",
          plateNumber: "AAE8556",
          timeSlot: "8",
          userId: "123",
          vehicleClassification: "Sedan",
        },
      },
      "2024-12-16": {
        "ND-417868": {
          appointmentId: "ND-417868",
          bayNumber: "Bay3",
          estCompletion: "3",
          plateNumber: "AAE8553",
          timeSlot: "8",
          userId: "123",
          vehicleClassification: "Sedan",
        },
      },
      "2024-12-21": {
        "ND-315958": {
          appointmentId: "ND-315958",
          bayNumber: "Bay3",
          plateNumber: "JJ6865",
          timeSlot: "8",
          userId: "123",
          vehicleClassification: "Motorcycle (Large)",
        },
      },
      "2024-12-31": {
        "ND-176376": {
          appointmentId: "ND-176376",
          bayNumber: "Bay3",
          estCompletion: "4",
          plateNumber: "123",
          timeSlot: "9",
          userId: "123",
          vehicleClassification: "Motorcycle (Large)",
        },
      },
    },
  },
  Reservations: {
    ReservationsByBranch: {
      "branch-1": {
        "12-12-2024": {
          "ND-368922": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Under Chassis",
                price: 100,
              },
            ],
            amountDue: 220,
            appointmentId: "ND-368922",
            branchAddress: "Branch 2, Mandaue City",
            branchName: "Bacolod",
            note: "I love you",
            paymentMethod: "COD",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 100,
              },
            ],
            status: "pending",
            timeSlot: {
              appointmentDate: "12/12/2024",
              available: true,
              estCompletion: "3",
              time: "10",
            },
            vehicleDetails: {
              classification: "Sedan",
              plateNumber: "AAE8556",
              vehicleName: "Oten",
            },
          },
        },
        "12-28-2024": {
          "ND-304606": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Under Chassis",
                price: 100,
              },
            ],
            amountDue: 120,
            appointmentId: "ND-304606",
            branchAddress: "Branch 2, Mandaue City",
            branchName: "Bacolod",
            note: "",
            paymentMethod: "E-Wallet",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 100,
              },
            ],
            status: "pending",
            timeSlot: {
              appointmentDate: "12/28/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "Motorcycle (Large)",
              plateNumber: "JJ6865",
              vehicleName: "iron883",
            },
          },
          "ND-825957": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Armour All",
                price: 100,
              },
            ],
            amountDue: 120,
            appointmentId: "ND-825957",
            branchAddress: "Branch 2, Mandaue City",
            branchName: "Bacolod",
            note: "",
            paymentMethod: "COD",
            services: [
              {
                estimatedTime: "2",
                name: "Value Wash",
                price: 120,
              },
            ],
            status: "pending",
            timeSlot: {
              appointmentDate: "12/28/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "Motorcycle (Large)",
              plateNumber: "JJ6865",
              vehicleName: "iron883",
            },
          },
        },
      },
      "branch-2": {
        "01-20-2025": {
          "ND-275454": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Under Chassis",
                price: 200,
              },
            ],
            amountDue: 400,
            appointmentId: "ND-275454",
            branchAddress: "Branch 1, Cebu City",
            branchName: "P. Mabolo",
            note: "",
            paymentMethod: "E-Wallet",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 180,
              },
            ],
            status: "pending",
            timeSlot: {
              appointmentDate: "1/20/2025",
              available: true,
              estCompletion: "3",
              time: "7",
            },
            vehicleDetails: {
              classification: "Sedan",
              plateNumber: "AAE8553",
              vehicleName: "Toyota Vios",
            },
          },
        },
        "12-10-2024": {
          "ND-596774": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Armour All",
                price: 100,
              },
            ],
            amountDue: 300,
            appointmentId: "ND-596774",
            branchAddress: "Branch 1, Cebu City",
            branchName: "P. Mabolo",
            note: "I want Ryan as my washer, thank you!!",
            paymentMethod: "COD",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 180,
              },
            ],
            status: "pending",
            timeSlot: {
              appointmentDate: "12/10/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "Sedan",
              plateNumber: "12345",
              vehicleName: "Test",
            },
          },
        },
        "12-12-2024": {
          "ND-404428": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Under Chassis",
                price: 200,
              },
            ],
            amountDue: 440,
            appointmentId: "ND-404428",
            branchAddress: "Branch 1, Cebu City",
            branchName: "P. Mabolo",
            note: "I want David to wash my car",
            paymentMethod: "COD",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 220,
              },
            ],
            status: "pending",
            timeSlot: {
              appointmentDate: "12/12/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "SUV",
              plateNumber: "AAE8556",
              vehicleName: "TestSUV",
            },
          },
        },
      },
      "branch-3": {
        "12-07-2024": {
          "ND-366138": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Under Chassis",
                price: 140,
              },
            ],
            amountDue: 160,
            appointmentId: "ND-366138",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            cancellationNote: "hs",
            cancellationReasons: ["Washer Unavailable", "Service Unavailable"],
            note: "",
            paymentMethod: "COD",
            selectedBay: "Bay4",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 130,
              },
            ],
            status: "completed",
            timeSlot: {
              appointmentDate: "12/7/2024",
              available: true,
              estCompletion: "3",
              time: "9",
            },
            vehicleDetails: {
              classification: "Motorcycle (Large)",
              plateNumber: "JJ6865",
              vehicleName: "iron883",
            },
          },
          "ND-834432": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Under Chassis",
                price: 140,
              },
            ],
            amountDue: 160,
            appointmentId: "ND-834432",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            note: "",
            paymentMethod: "Card Payment",
            selectedBay: "Bay3",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 130,
              },
            ],
            status: "completed",
            timeSlot: {
              appointmentDate: "12/07/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "Motorcycle (Large)",
              plateNumber: "JJ6865",
              vehicleName: "iron883",
            },
          },
        },
        "12-10-2024": {
          "ND-301722": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Armour All",
                price: 120,
              },
            ],
            amountDue: 270,
            appointmentId: "ND-301722",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            cancellationNote: "",
            cancellationReasons: ["Late arrival"],
            note: "",
            paymentMethod: "COD",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 130,
              },
            ],
            status: "cancelled",
            timeSlot: {
              appointmentDate: "12/10/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "Sedan",
              plateNumber: "AAE8556",
              vehicleName: "TestSUV",
            },
          },
          "ND-362194": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Armour All",
                price: 120,
              },
            ],
            amountDue: 140,
            appointmentId: "ND-362194",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            cancellationNote: "",
            cancellationReasons: ["Power Interruption"],
            note: "I'd like to have Michael as my washer",
            paymentMethod: "COD",
            selectedBay: "Bay4",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 130,
              },
            ],
            status: "cancelled",
            timeSlot: {
              appointmentDate: "12/10/2024",
              available: true,
              estCompletion: "3",
              time: "9",
            },
            vehicleDetails: {
              classification: "Pick Up",
              plateNumber: "GAC231",
              vehicleName: "Raptor",
            },
          },
          "ND-949278": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Armour All",
                price: 120,
              },
            ],
            amountDue: 270,
            appointmentId: "ND-949278",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            note: "",
            paymentMethod: "COD",
            selectedBay: "Bay3",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 130,
              },
            ],
            status: "completed",
            timeSlot: {
              appointmentDate: "12/10/2024",
              available: true,
              estCompletion: "3",
              time: "6",
            },
            vehicleDetails: {
              classification: "Sedan",
              plateNumber: "12345",
              vehicleName: "Test",
            },
          },
        },
        "12-12-2024": {
          "ND-103437": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Armour All",
                price: 120,
              },
            ],
            amountDue: 270,
            appointmentId: "ND-103437",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            note: "I want David as my washer please",
            paymentMethod: "COD",
            selectedBay: "Bay3",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 130,
              },
            ],
            status: "completed",
            timeSlot: {
              appointmentDate: "12/12/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "Sedan",
              plateNumber: "AAE8556",
              vehicleName: "Toyota Vios",
            },
          },
        },
        "12-16-2024": {
          "ND-417868": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Armour All",
                price: 120,
              },
            ],
            amountDue: 280,
            appointmentId: "ND-417868",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            note: "oten",
            paymentMethod: "COD",
            selectedBay: "Bay3",
            services: [
              {
                estimatedTime: "2",
                name: "Value Wash",
                price: 140,
              },
            ],
            status: "completed",
            timeSlot: {
              appointmentDate: "12/16/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "Sedan",
              plateNumber: "AAE8553",
              vehicleName: "Toyota Vios",
            },
          },
        },
        "12-21-2024": {
          "ND-315958": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Under Chassis",
                price: 140,
              },
            ],
            amountDue: 160,
            appointmentId: "ND-315958",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            cancellationNote: "",
            cancellationReasons: ["Power Interruption"],
            note: "",
            paymentMethod: "E-Wallet",
            selectedBay: "Bay3",
            services: [
              {
                estimatedTime: "2",
                name: "Value Wash",
                price: 140,
              },
            ],
            status: "cancelled",
            timeSlot: {
              appointmentDate: "12/21/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "Motorcycle (Large)",
              plateNumber: "JJ6865",
              vehicleName: "iron883",
            },
          },
        },
        "12-30-2024": {
          "ND-291977": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Under Chassis",
                price: 140,
              },
            ],
            amountDue: 300,
            appointmentId: "ND-291977",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            note: "vh",
            paymentMethod: "E-Wallet",
            services: [
              {
                estimatedTime: "2",
                name: "Value Wash",
                price: 140,
              },
            ],
            status: "pending",
            timeSlot: {
              appointmentDate: "12/30/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "Sedan",
              plateNumber: "AAE8553",
              vehicleName: "Toyota Vios",
            },
          },
        },
        "12-31-2024": {
          "ND-176376": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Armour All",
                price: 120,
              },
              {
                estimatedTime: "1",
                name: "Under Chassis",
                price: 140,
              },
            ],
            amountDue: 280,
            appointmentId: "ND-176376",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            cancellationNote: "",
            cancellationReasons: ["Late arrival"],
            note: "",
            paymentMethod: "E-Wallet",
            selectedBay: "Bay3",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 130,
              },
            ],
            status: "cancelled",
            timeSlot: {
              appointmentDate: "12/31/2024",
              available: true,
              estCompletion: "4",
              time: "9",
            },
            vehicleDetails: {
              classification: "Motorcycle (Large)",
              plateNumber: "123",
              vehicleName: "hakdog",
            },
          },
        },
        Bays: {
          Bay3: {
            status: "unavailable",
          },
          Bay4: {
            status: "unavailable",
          },
        },
      },
    },
    ReservationsByUser: {
      "123": {
        "01-20-2025": {
          "ND-275454": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Under Chassis",
                price: 200,
              },
            ],
            amountDue: 400,
            appointmentId: "ND-275454",
            branchAddress: "Branch 1, Cebu City",
            branchName: "P. Mabolo",
            note: "",
            paymentMethod: "E-Wallet",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 180,
              },
            ],
            status: "pending",
            timeSlot: {
              appointmentDate: "1/20/2025",
              available: true,
              estCompletion: "3",
              time: "7",
            },
            vehicleDetails: {
              classification: "Sedan",
              plateNumber: "AAE8553",
              vehicleName: "Toyota Vios",
            },
          },
        },
        "12-07-2024": {
          "ND-366138": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Under Chassis",
                price: 140,
              },
            ],
            amountDue: 160,
            appointmentId: "ND-366138",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            cancellationNote: "hs",
            cancellationReasons: ["Washer Unavailable", "Service Unavailable"],
            note: "",
            paymentMethod: "COD",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 130,
              },
            ],
            status: "completed",
            timeSlot: {
              appointmentDate: "12/7/2024",
              available: true,
              estCompletion: "3",
              time: "9",
            },
            vehicleDetails: {
              classification: "Motorcycle (Large)",
              plateNumber: "JJ6865",
              vehicleName: "iron883",
            },
          },
          "ND-834432": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Under Chassis",
                price: 140,
              },
            ],
            amountDue: 160,
            appointmentId: "ND-834432",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            note: "",
            paymentMethod: "Card Payment",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 130,
              },
            ],
            status: "completed",
            timeSlot: {
              appointmentDate: "12/07/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "Motorcycle (Large)",
              plateNumber: "JJ6865",
              vehicleName: "iron883",
            },
          },
        },
        "12-10-2024": {
          "ND-301722": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Armour All",
                price: 120,
              },
            ],
            amountDue: 270,
            appointmentId: "ND-301722",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            cancellationNote: "",
            cancellationReasons: ["Late arrival"],
            note: "",
            paymentMethod: "COD",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 130,
              },
            ],
            status: "cancelled",
            timeSlot: {
              appointmentDate: "12/10/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "Sedan",
              plateNumber: "AAE8556",
              vehicleName: "TestSUV",
            },
          },
          "ND-362194": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Armour All",
                price: 120,
              },
            ],
            amountDue: 140,
            appointmentId: "ND-362194",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            cancellationNote: "",
            cancellationReasons: ["Power Interruption"],
            note: "I'd like to have Michael as my washer",
            paymentMethod: "COD",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 130,
              },
            ],
            status: "cancelled",
            timeSlot: {
              appointmentDate: "12/10/2024",
              available: true,
              estCompletion: "3",
              time: "9",
            },
            vehicleDetails: {
              classification: "Pick Up",
              plateNumber: "GAC231",
              vehicleName: "Raptor",
            },
          },
          "ND-596774": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Armour All",
                price: 100,
              },
            ],
            amountDue: 300,
            appointmentId: "ND-596774",
            branchAddress: "Branch 1, Cebu City",
            branchName: "P. Mabolo",
            note: "I want Ryan as my washer, thank you!!",
            paymentMethod: "COD",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 180,
              },
            ],
            status: "pending",
            timeSlot: {
              appointmentDate: "12/10/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "Sedan",
              plateNumber: "12345",
              vehicleName: "Test",
            },
          },
          "ND-949278": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Armour All",
                price: 120,
              },
            ],
            amountDue: 270,
            appointmentId: "ND-949278",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            note: "",
            paymentMethod: "COD",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 130,
              },
            ],
            status: "completed",
            timeSlot: {
              appointmentDate: "12/10/2024",
              available: true,
              estCompletion: "3",
              time: "6",
            },
            vehicleDetails: {
              classification: "Sedan",
              plateNumber: "12345",
              vehicleName: "Test",
            },
          },
        },
        "12-12-2024": {
          "ND-103437": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Armour All",
                price: 120,
              },
            ],
            amountDue: 270,
            appointmentId: "ND-103437",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            note: "I want David as my washer please",
            paymentMethod: "COD",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 130,
              },
            ],
            status: "completed",
            timeSlot: {
              appointmentDate: "12/12/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "Sedan",
              plateNumber: "AAE8556",
              vehicleName: "Toyota Vios",
            },
          },
          "ND-368922": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Under Chassis",
                price: 100,
              },
            ],
            amountDue: 220,
            appointmentId: "ND-368922",
            branchAddress: "Branch 2, Mandaue City",
            branchName: "Bacolod",
            note: "I love you",
            paymentMethod: "COD",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 100,
              },
            ],
            status: "pending",
            timeSlot: {
              appointmentDate: "12/12/2024",
              available: true,
              estCompletion: "3",
              time: "10",
            },
            vehicleDetails: {
              classification: "Sedan",
              plateNumber: "AAE8556",
              vehicleName: "Oten",
            },
          },
          "ND-404428": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Under Chassis",
                price: 200,
              },
            ],
            amountDue: 440,
            appointmentId: "ND-404428",
            branchAddress: "Branch 1, Cebu City",
            branchName: "P. Mabolo",
            note: "I want David to wash my car",
            paymentMethod: "COD",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 220,
              },
            ],
            status: "pending",
            timeSlot: {
              appointmentDate: "12/12/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "SUV",
              plateNumber: "AAE8556",
              vehicleName: "TestSUV",
            },
          },
        },
        "12-16-2024": {
          "ND-417868": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Armour All",
                price: 120,
              },
            ],
            amountDue: 280,
            appointmentId: "ND-417868",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            note: "oten",
            paymentMethod: "COD",
            services: [
              {
                estimatedTime: "2",
                name: "Value Wash",
                price: 140,
              },
            ],
            status: "completed",
            timeSlot: {
              appointmentDate: "12/16/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "Sedan",
              plateNumber: "AAE8553",
              vehicleName: "Toyota Vios",
            },
          },
        },
        "12-21-2024": {
          "ND-315958": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Under Chassis",
                price: 140,
              },
            ],
            amountDue: 160,
            appointmentId: "ND-315958",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            cancellationNote: "",
            cancellationReasons: ["Power Interruption"],
            note: "",
            paymentMethod: "E-Wallet",
            services: [
              {
                estimatedTime: "2",
                name: "Value Wash",
                price: 140,
              },
            ],
            status: "cancelled",
            timeSlot: {
              appointmentDate: "12/21/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "Motorcycle (Large)",
              plateNumber: "JJ6865",
              vehicleName: "iron883",
            },
          },
        },
        "12-28-2024": {
          "ND-304606": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Under Chassis",
                price: 100,
              },
            ],
            amountDue: 120,
            appointmentId: "ND-304606",
            branchAddress: "Branch 2, Mandaue City",
            branchName: "Bacolod",
            note: "",
            paymentMethod: "E-Wallet",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 100,
              },
            ],
            status: "pending",
            timeSlot: {
              appointmentDate: "12/28/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "Motorcycle (Large)",
              plateNumber: "JJ6865",
              vehicleName: "iron883",
            },
          },
          "ND-825957": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Armour All",
                price: 100,
              },
            ],
            amountDue: 120,
            appointmentId: "ND-825957",
            branchAddress: "Branch 2, Mandaue City",
            branchName: "Bacolod",
            note: "",
            paymentMethod: "COD",
            services: [
              {
                estimatedTime: "2",
                name: "Value Wash",
                price: 120,
              },
            ],
            status: "pending",
            timeSlot: {
              appointmentDate: "12/28/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "Motorcycle (Large)",
              plateNumber: "JJ6865",
              vehicleName: "iron883",
            },
          },
        },
        "12-30-2024": {
          "ND-291977": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Under Chassis",
                price: 140,
              },
            ],
            amountDue: 300,
            appointmentId: "ND-291977",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            note: "vh",
            paymentMethod: "E-Wallet",
            services: [
              {
                estimatedTime: "2",
                name: "Value Wash",
                price: 140,
              },
            ],
            status: "pending",
            timeSlot: {
              appointmentDate: "12/30/2024",
              available: true,
              estCompletion: "3",
              time: "8",
            },
            vehicleDetails: {
              classification: "Sedan",
              plateNumber: "AAE8553",
              vehicleName: "Toyota Vios",
            },
          },
        },
        "12-31-2024": {
          "ND-176376": {
            addOns: [
              {
                estimatedTime: "1",
                name: "Armour All",
                price: 120,
              },
              {
                estimatedTime: "1",
                name: "Under Chassis",
                price: 140,
              },
            ],
            amountDue: 280,
            appointmentId: "ND-176376",
            branchAddress: "Branch 3, Talisay City",
            branchName: "Urgello",
            cancellationNote: "",
            cancellationReasons: ["Late arrival"],
            note: "",
            paymentMethod: "E-Wallet",
            services: [
              {
                estimatedTime: "2",
                name: "Body Wash",
                price: 130,
              },
            ],
            status: "cancelled",
            timeSlot: {
              appointmentDate: "12/31/2024",
              available: true,
              estCompletion: "4",
              time: "9",
            },
            vehicleDetails: {
              classification: "Motorcycle (Large)",
              plateNumber: "123",
              vehicleName: "hakdog",
            },
          },
        },
      },
    },
  },
  "Vehicle Information": {
    AAE8553: {
      vehicleClassification: "Sedan",
      vehicleImageResId: 2131231090,
      vname: "Toyota Vios",
      vplateNumber: "AAE8553",
    },
    "YV-28288": {
      vehicleClassification: "SUV",
      vehicleImageResId: 2131231090,
      vname: "Raize ",
      vplateNumber: "YV-28288",
    },
  },
  users: {
    "0qJ8hyWeURcCe3hjgNu5yhL03e33": {
      email: "aparcejohnharley@gmail.com",
      firstName: "joqu",
      lastName: "Harley",
      profileImage: "",
    },
    CDF43ekjIoWGYrX42nt0OLA9v943: {
      email: "admin@gmail.com",
      firstName: "Admin",
      lastName: "Admin",
      role: "admin",
    },
    Kt5gp0XIEZcsvRpeUyjMaohudzk2: {
      email: "yankinyurii123@gmail.com",
      firstName: "yuriihh",
      lastName: "yankinhh",
      profileImage: "content://media/external/images/media/1000037047",
      role: "default",
    },
    X0nmfm6FP3YJf2WjiSpv3skhwIq1: {
      email: "angelomelcortes06@gmail.com",
      firstName: "Mel",
      lastName: "Cortes",
      profileImage:
        "content://com.google.android.apps.photos.contentprovider/-1/1/content%3A%2F%2Fmedia%2Fexternal%2Fimages%2Fmedia%2F1000000034/ORIGINAL/NONE/image%2Fjpeg/670397793",
      role: "default",
    },
    bWuQ8oBTzGY2caN8j5iwETaK46y1: {
      email: "laoguicorye@gmail.com",
      firstName: "Rye",
      lastName: "Lao Guico",
      profileImage: "",
      role: "default",
    },
    dUe6JF6Ivqalz5iXfi6Bx37XCWu2: {
      email: "joqu.aparece.swu@phinmaed.com",
      firstName: "John",
      lastName: "Harley",
      profileImage: "",
      role: "default",
    },
  },
}
