var _currencies = [{ "id": "1", "text": "EUR" }, { "id": "2", "text": "ALL" }, { "id": "3", "text": "GBP" }];
var _commercialterms = [{"commercialterms_id":"1","name":"Arke"},{"commercialterms_id":"2","name":"Banke"}];
//RCAs
var _suppliers = [{
    "supplier_id": "1",
    "supplier_name": "Kreatx"
}, {
    "supplier_id": "2",
    "supplier_name": "Horizon"
}, {
    "supplier_id": "3",
    "supplier_name": "Albanian Technology Distribution"
}];
var _warehouses =  [{
    "warehouse_id": "1",
    "warehouse_name": "TR Magazina 1"
}, {
    "warehouse_id": "2",
    "warehouse_name": "DR Magazina 2"
}, {
    "warehouse_id": "3",
    "warehouse_name": "FR Magazina 3"
}];
var _orders = [{"order_id":1, "order_resume":"7777-Acme"}];
var _signees = [{"employee_id":1, "employee_name":"Ryu"}];
var myForm = 
{
    ctor: Form,
    props: {
        id: 'form',
        formName: 'My Form',
        action:"",
        components: [
            {
                ctor: Container,
                props: {
                    id: 'nestedLayout',
                    components:[
                        {
                            ctor: Container,
                            props: {
                                id: '',
                                type:ContainerType.ROW,
                                components:[
                                    {
                                        ctor: Container,
                                        props: {
                                            id: '',
                                            type:ContainerType.COLUMN,
                                            spacing: {colSpan:3},
                                            classes:["border"],
                                            components:[
                                                {
                                                    ctor: FormField,
                                                    props: {
                                                        id: 'formFieldEx',
                                                        label: 'Data',
                                                        name: 'document_date',
                                                        size: FormFieldSize.SMALL,
                                                        component: {
                                                            ctor:DateTime,
                                                            props:{
                                                                id: 'document_date',
                                                                inputFormat: 'DD/MM/YYYY',
                                                                outputFormat: 'DD-MM-YYYY',
                                                                displayFormat: 'MM/DD/YYYY',
                                                                value: '2022/02/04'
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    ctor: FormField,
                                                    props: {
                                                        id: 'formFieldEx',
                                                        label: 'Nr. Serial',
                                                        name: 'serial_number',
                                                        size: FormFieldSize.SMALL,
                                                        component: {
                                                            ctor:TextInput,
                                                            props:{
                                                                id: 'serial_number',
                                                                value: ''
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    ctor: FormField,
                                                    props: {
                                                        id: 'formFieldEx',
                                                        label: 'Nr. Dokumenti',
                                                        name: 'document_number',
                                                        size: FormFieldSize.SMALL,
                                                        component: {
                                                            ctor:TextInput,
                                                            props:{
                                                                id: 'document_number',
                                                                value: ''
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        ctor: Container,
                                        props: {
                                            id: '',
                                            type:ContainerType.COLUMN,
                                            spacing: {colSpan:3},
                                            classes:["border"],
                                            components:[
                                                {
                                                    ctor: FormField,
                                                    props: {
                                                        id: 'formFieldEx',
                                                        label: 'Example formField',
                                                        name: 'formFieldEx',
                                                        size: FormFieldSize.SMALL,
                                                        component: {
                                                            ctor:Amount,
                                                            props: {
                                                                id: 'amount',
                                                                currencyList: _currencies,
                                                                value: {
                                                                    "amount": "132323",
                                                                    "currency": "2"
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    ctor: FormField,
                                                    props: {
                                                        id: 'formFieldEx',
                                                        label: 'Termat Tregtare',
                                                        name: 'id_commercialterms',
                                                        size: FormFieldSize.SMALL,
                                                        component: {
                                                            ctor: Select,
                                                            props: {
                                                                id: 'id_commercialterms',
                                                                dataProvider: _commercialterms,
                                                                textField: "name",
                                                                valueField: "commercialterms_id",
                                                                value: [],
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    ctor: FormField,
                                                    props: {
                                                        id: 'formFieldEx',
                                                        label: 'Monedha/Kursi',
                                                        name: 'formFieldEx',
                                                        size: FormFieldSize.SMALL,
                                                        component: {
                                                            ctor: CurrencyExRate,
                                                            props: {
                                                                id: 'amount',
                                                                currencyList: _currencies,
                                                                value: {
                                                                    "amount": "132323",
                                                                    "currency": "2"
                                                                }
                                                            }
                                                        }
                                                    }
                                                } 
                                            ]
                                        }
                                    },
                                    {
                                        ctor: Container,
                                        props: {
                                            id: '',
                                            type:ContainerType.COLUMN,
                                            spacing: {colSpan:3},
                                            classes:["border"],
                                            components:[
                                                {
                                                    ctor: FormField,
                                                    props: {
                                                        id: 'formFieldEx',
                                                        label: 'Furnitori',
                                                        name: 'formFieldEx',
                                                        size: FormFieldSize.SMALL,
                                                        component: {
                                                            ctor:AutoCompleteEx,
                                                            props: {
                                                                id: 'suppliers_id_supplier',
                                                                valueField: "supplier_id",
                                                                labelField: "supplier_name",
                                                                allowNewItem: false,
                                                                dataProvider: _suppliers,
                                                                value: [{ "supplier_id": "1"}],
                                                                multiSelect: false,
                                                                matchType:StringMatchType.STARTS_WITH
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    ctor: FormField,
                                                    props: {
                                                        id: 'formFieldEx',
                                                        label: 'Magazina',
                                                        name: 'formFieldEx',
                                                        size: FormFieldSize.SMALL,
                                                        component: {
                                                            ctor:AutoCompleteEx,
                                                            props: {
                                                                id: 'idwarehouse_entry',
                                                                valueField: "warehouse_id",
                                                                labelField: "warehouse_name",
                                                                allowNewItem: false,
                                                                dataProvider: _warehouses,
                                                                value: [{ "warehouse_id": "1"}],
                                                                multiSelect: false,
                                                                matchType:StringMatchType.STARTS_WITH
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    ctor: FormField,
                                                    props: {
                                                        id: 'formFieldEx',
                                                        label: 'Urdher Blerje',
                                                        name: 'formFieldEx',
                                                        size: FormFieldSize.SMALL,
                                                        component: {
                                                            ctor:AutoCompleteEx,
                                                            props: {
                                                                id: 'id_order',
                                                                valueField: "order_id",
                                                                labelField: "order_resume",
                                                                allowNewItem: false,
                                                                dataProvider: _orders,
                                                                value: [{ "order_id": "1"}],
                                                                multiSelect: false,
                                                                matchType:StringMatchType.STARTS_WITH
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        ctor: Container,
                                        props: {
                                            id: '',
                                            type:ContainerType.COLUMN,
                                            spacing: {colSpan:3},
                                            classes:["border"],
                                            components:[
                                                {
                                                    ctor: FormField,
                                                    props: {
                                                        id: 'formFieldEx',
                                                        label: 'Bleresi',
                                                        name: 'formFieldEx',
                                                        size: FormFieldSize.SMALL,
                                                        component: {
                                                            ctor:AutoCompleteEx,
                                                            props: {
                                                                id: 'id_order',
                                                                valueField: "order_id",
                                                                labelField: "order_resume",
                                                                allowNewItem: false,
                                                                dataProvider: _orders,
                                                                value: [{ "order_id": "1"}],
                                                                multiSelect: false,
                                                                matchType:StringMatchType.STARTS_WITH
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    ctor: FormField,
                                                    props: {
                                                        id: 'formFieldEx',
                                                        label: 'Firmosi',
                                                        name: 'formFieldEx',
                                                        size: FormFieldSize.SMALL,
                                                        component: {
                                                            ctor:AutoCompleteEx,
                                                            props: {
                                                                id: 'signee',
                                                                valueField: "employee_id",
                                                                labelField: "employee_name",
                                                                allowNewItem: false,
                                                                dataProvider: _signees,
                                                                value: [{ "employee_id": "1"}],
                                                                multiSelect: false,
                                                                matchType:StringMatchType.STARTS_WITH
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    ctor: FormField,
                                                    props: {
                                                        id: 'formFieldEx',
                                                        label: 'Pershkrim',
                                                        name: 'formFieldEx',
                                                        size: FormFieldSize.SMALL,
                                                        component: {
                                                            ctor:TextArea,
                                                            props: {
                                                                id: 'description',
                                                                spellCheck: {
                                                                    defaultDictionary: 'English',//Albanian
                                                                },
                                                                value: ''
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    }
};


var myForm2 = {
    ctor: Container,
    props: {
        id: '',
        components:[{
                ctor: Form,
                props: {
                    id: '',
                    spacing: {colSpan:3},
                    classes:["border"],
                    components:[
                        {
                            ctor: FormField,
                            props: {
                                id: 'formFieldEx',
                                label: 'Example formField',
                                name: 'formFieldEx',
                                size: FormFieldSize.SMALL,
                                component: {
                                    ctor:Amount,
                                    props: {
                                        id: 'amount',
                                        currencyList: _currencies,
                                        value: {
                                            "amount": "132323",
                                            "currency": "2"
                                        }
                                    }
                                }
                            }
                        },
                        {
                            ctor: FormField,
                            props: {
                                id: 'formFieldEx',
                                label: 'Termat Tregtare',
                                name: 'id_commercialterms',
                                size: FormFieldSize.SMALL,
                                component: {
                                    ctor: Select,
                                    props: {
                                        id: 'id_commercialterms',
                                        dataProvider: _commercialterms,
                                        textField: "name",
                                        valueField: "commercialterms_id",
                                        value: [],
                                    }
                                }
                            }
                        },
                        {
                            ctor: FormField,
                            props: {
                                id: 'formFieldEx',
                                label: 'Monedha/Kursi',
                                name: 'formFieldEx',
                                size: FormFieldSize.SMALL,
                                component: {
                                    ctor: CurrencyExRate,
                                    props: {
                                        id: 'amount',
                                        currencyList: _currencies,
                                        value: {
                                            "amount": "132323",
                                            "currency": "2"
                                        }
                                    }
                                }
                            }
                        } 
                    ]
                }
            }
        ]
    }
};
var myContainerTemplateLiteral = {
    ctor: Container,
    props: {
        id: '',
        components:[{
                ctor: Form,
                props: {
                    id: '',
                    spacing: {colSpan:3},
                    classes:["border"],
                    components:[
                        "{{movingPart.formfield}}",
                        {
                            ctor: FormField,
                            props: {
                                id: 'formFieldEx',
                                label: 'Termat Tregtare',
                                name: 'id_commercialterms',
                                size: FormFieldSize.SMALL,
                                component: {
                                    ctor: Select,
                                    props: {
                                        id: 'id_commercialterms',
                                        dataProvider: _commercialterms,
                                        textField: "name",
                                        valueField: "commercialterms_id",
                                        value: [],
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ]
    }
};
var movingPart = {};
movingPart.formfield = {
    ctor: FormField,
    props: {
        id: 'formFieldEx',
        label: 'Example formField',
        name: 'formFieldEx',
        size: FormFieldSize.SMALL,
        component: {
            ctor:Amount,
            props: {
                id: 'amount',
                currencyList: _currencies,
                value: {
                    "amount": "132323",
                    "currency": "2"
                }
            }
        }
    }
};
movingPart.view2 = myContainerTemplateLiteral;

var myContainerTemplate = new JTemplate(myContainerTemplateLiteral);
//var myContainerChildrenTemplate = new JTemplate([myForm, "{{movingPart.view2}}"]);
//[myForm, myForm2, myContainerTemplate]

//kjo klasa APP mesiper duhet quajtuar view 
//viewve tu ndryshojme datat 
//APP klase qe ka disa view dhe we can switch between them, object pooling per strukturen.
var literalTemplate = new JTemplate("{\"obj\":{{hello.world}}}");
var oxana = new App({
    components:[
        {
            ctor: ViewStack,
            props: {
                components: [myForm, myForm2, myContainerTemplate]
            }
        }        
    ]});
oxana.behaviors["CMP_ID_HERE"] = {};
oxana.behaviors["CMP_ID_HERE"]["CMP_EVENT"] = "BEHAVIOR";
oxana.init();


/*


<HBox width="100%" horizontalGap="30" height="130">	

	<VBox>
		<combobox name="id_commercialterms" width="160" enabled="@{tabnav.selectedIndex==0 || tabnav.selectedIndex==1}" selectedValue="" dataField="commercialterms_id" labelField="name" data="*{commercialterms}" newrecordcontroller="accounting/controller/?commercialtermsCRUD" newrecordaction="showNewWin" label="Termat Tregtare" change="commercialtermChanged"/>
		<HBox formItem="true" formLabel="Monedha/Kursi" required="true">
			<combobox name="id_currency" width="80" dataField="currency_id" labelField="name" selectedValue="2"  data="*{currencies}" showtips="true" required="true" change="changeCurr"/>
			<number name="exchange_rate" labelOnError="Kursi" text="1" enabled="@{id_currency.selectedValue!=2}" required="true" width="72" textchange="exchange_rate_changed" allowNegative="false" min="0" restrict="0-9." precision="2"/>
		</HBox>	
		<textarea name="description" label="Pershkrimi" maxChars="800" height="60">
			<text>
							</text>
		</textarea>	
	</VBox>
	<VBox width="100%">
		<HBox formItem="true" required="true" formLabel="Furnitori" horizontalGap="1" width="100%">
			<autocomplete inputDoubleClick="selectSupplier('invoice', 'suppliers_id_supplier')" dropdownWidth="300" required="true" name="id_supplier" labelOnError="Furnitori" width="100%" labelField="supplier_resume" data="*{suppliers}" selectedItems="*{suppliers_id_supplier}" doubleclick="show_supplierCurrencyExRatePopup" textchange="getsuppliers" change="id_supplier_changed"/>
			<button click="selectSupplier('invoice', 'suppliers_id_supplier')" height="25" paddingLeft="1" width="27" upSkinVisible="false" theme="vivid" tabEnabled="false" icon="@Embed(source='ReusableIcons.swf', symbol='browseIcon')"/>
		</HBox>
		<!--<label width="100%" visible="" includeInLayout="" >
			<style>
				<textAlign value="right"/>
				<color v="0xff0000"/>
				<fontSize v="11"/>
				<fontStyle v="italic"/>
			</style>
			<text>
							</text>
		</label>-->
		<HBox formItem="true" formLabel="Magazina" toolTip="Hyrje ne Magazine" horizontalGap="1" width="100%" enabled="@{tabnav.selectedIndex==0}" >
			<autocomplete inputDoubleClick="selectWarehouse('invoice','warehouses_idwarehouse_entry')" textchange="getWarehouse" dropdownWidth="300" name="idwarehouse_entry" width="100%" labelOnError="Magazina" labelField="warehouse_resume" data="*{warehouses}" selectedItems="*{warehouses_idwarehouse_entry}"/>
			<button click="selectWarehouse('invoice','warehouses_idwarehouse_entry')" height="25" paddingLeft="1" width="27" upSkinVisible="false" theme="vivid" tabEnabled="false" icon="@Embed(source='ReusableIcons.swf', symbol='browseIcon')"/>
					</HBox>
		<HBox formItem="true" formLabel="Urdher Blerje" horizontalGap="1" enabled="@{tabnav.selectedIndex==0}" width="100%">
			<autocomplete inputDoubleClick="selectPurchaseOrder('invoice','orders_id_order')" labelField="orderdetails" textchange="getPurchaseOrders" change="purchaseOrderChanged" dropdownWidth="300" name="id_purchaseorderheader" width="100%" labelOnError="Urdhër Blerje" data="*{orders}" selectedItems="*{orders_id_order}"/>
			<button click="selectPurchaseOrder('invoice','orders_id_order')" height="25" paddingLeft="1" width="27" upSkinVisible="false" theme="vivid" tabEnabled="false" icon="@Embed(source='ReusableIcons.swf', symbol='browseIcon')"/>
		</HBox>
		<HBox formLabel="Periudha" formItem="true" horizontalGap="1" width="100%">
			<combobox name="report_period" width="80" dataField="report_period" labelField="report_period" selectedValue="" data="*{report_periods}" showtips="true" required="true"/>
			<HBox paddingLeft="60"><checkbox name="is_investment" label="Investim" selected="false" /></HBox>
		</HBox>
	</VBox>
</HBox>
*/