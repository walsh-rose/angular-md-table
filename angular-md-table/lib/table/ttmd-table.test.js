export default (ngModule) => {
    describe('Table component', () => {

        let $compile, directiveElem, directiveCtrl, $scope, PaginationModel, state, ttMdTable, $mdMedia;

        beforeEach(window.module(ngModule.name));
        beforeEach(inject(function (_$compile_, _$rootScope_, _PaginationModel_, _$state_, _ttMdTable_, _$mdMedia_) {
            $compile = _$compile_;
            $scope = _$rootScope_.$new();

            state = _$state_;
            spyOn(state, 'go');
            spyOn(state, 'transitionTo');

            $mdMedia = _$mdMedia_;
            PaginationModel = _PaginationModel_;
            ttMdTable = _ttMdTable_;

            directiveElem = getCompiledElement();
            directiveCtrl = directiveElem.controller('ttmdTable');
        }));


        it('should hasTransclude() return true', () => {
            expect(directiveCtrl.hasTransclude('actions')).toEqual(true);
        });

        it('should have return the limits as the items length', () => {
            expect(directiveCtrl.getLimitTo()).toEqual(directiveCtrl.items.length);
            $scope.items = [
                ...$scope.items,
                ...$scope.items,
                ...$scope.items
            ];
            $scope.$digest();
            expect(directiveCtrl.getLimitTo()).toEqual(12);
        });

        it('should have reutrn the limits according the limits if totalNumber is set, desktop limits is 8', () => {
            expect(directiveCtrl.getLimitTo()).toEqual(directiveCtrl.items.length);
            directiveCtrl.model.forceDesktop = true;
            $scope.items = [
                ...$scope.items,
                ...$scope.items,
                ...$scope.items
            ];
            $scope.totalNumber = 24;
            $scope.$digest();
            expect(directiveCtrl.items.length).toBeGreaterThan(8);
            expect(directiveCtrl.getLimitTo()).toEqual(8);
        });

        it('should return empty when sort array is not set', () => {
            expect(directiveCtrl.getOrderBy()).toEqual('');
        });


        describe('goMobile()', () => {
            "use strict";
            describe('Desktop', ()=> {
                beforeEach(() => {
                    directiveCtrl.model.forceDesktop = true;
                    $scope.$digest();
                });

                it('should return true if force-mobile is set', () => {
                    directiveCtrl.model.forceDesktop = false;
                    $scope.forceMobile = true;
                    $scope.$digest();
                    expect(directiveCtrl.goMobile()).toEqual(true);
                });

                it('should return false', () => {
                    expect(directiveCtrl.goMobile()).toEqual(false);
                });
            });

            describe('mobile', ()=> {
                beforeEach(() => {
                    directiveCtrl.model.forceDesktop = false;
                    $scope.$digest();
                });

                it('should return true', () => {
                    expect(directiveCtrl.goMobile()).toEqual(true);
                });
            });

        });

        describe('exclude', () => {
            beforeEach(()=> {
                $scope.exclude = ["username"];
                $scope.sort = ['dueDate'];
                $scope.$digest();
            });

            it('should not find the username anymore', () => {
                let children = directiveElem.find('ttmd-mobile-item');
                let el = angular.element(children[0]).html();
                expect(el).not.toContain("Milton Mraz");
                expect(el).toContain("8.03");
            });

            it('should not find the amount and username', () => {

                $scope.exclude = ["username", "amount"];
                $scope.$digest();
                let children = directiveElem.find('ttmd-mobile-item');
                let el = angular.element(children[0]).html();
                expect(el).not.toContain("Milton Mraz");
                expect(el).not.toContain("8.03");
            });
        });


        describe('Passed in sort attr', () => {
            beforeEach(() => {
                $scope.sort = ['dueDate'];
                $scope.$digest();
            });

            it('should return dueDate when sort array is passed in', () => {
                expect(directiveCtrl.getOrderBy()).toEqual('dueDate');
            });

            it('should have the first row for the early due date with name Milton Mraz', () => {
                let children = directiveElem.find('ttmd-mobile-item');
                let el = angular.element(children[0]).html();
                expect(el).toContain("Milton Mraz");
            });

            it('should have the last row for the latest due date with the name Alessandro Kassulke', () => {
                let children = directiveElem.find('ttmd-mobile-item');
                let el = angular.element(children[children.length - 1]).html();
                expect(el).toContain("Alessandro Kassulke");
            });

        });

        describe('Basic information: items only', () => {

            beforeEach(() => {
                $scope.headers = undefined;
                $scope.$digest();
            });

            it('should have items but no headers', () => {
                expect(directiveCtrl).toBeDefined();
                expect(directiveCtrl.items.length).toEqual($scope.items.length);
                expect(directiveCtrl.headers).toBeUndefined();
                expect(directiveCtrl.items[0].username).toEqual("Milton Mraz");
            });

            it('should have no list-title class', () => {
                let toolbar = directiveElem.find('.list-title');
                expect(toolbar.length).toEqual(0);
            });

            it('should have no pagination', () => {
                let pagination = directiveElem.find('ttmd-pagination');
                expect(pagination.length).toEqual(0);
            });

            it('should have four row of items', () => {
                let rows = directiveElem.find('.list-row');
                expect(rows.length).toEqual(4);
            });
        });


        describe('Basic information: items and header test', () => {
            it('should have items and headers', () => {
                expect(directiveCtrl).toBeDefined();
                expect(directiveCtrl.items).toBeDefined();
                expect(directiveCtrl.headers.length).toEqual($scope.headers.length);
                expect(directiveCtrl.headers[0]).toEqual("id");
            });

            it('should have five columns headers on desktop view', () => {
                directiveCtrl.model.forceDesktop = true;
                $scope.$digest();
                let headers = directiveElem.find('.list-header');
                let children = headers.find('.header-item');
                expect(children.length).toEqual(5);
            });

            it('should have no headers on mobile view', () => {
                directiveCtrl.model.forceDesktop = false;
                directiveCtrl.model.forceMobile = true;
                $scope.$digest();
                let headers = directiveElem.find('.list-header');
                expect(headers.length).toEqual(0);
            });
        });

        describe('toolbar related test', () => {
            beforeEach(() => {
                $scope.toolbar = {
                    title: 'Great',
                    icon: 'account_circle'
                };
                $scope.$digest();
            });

            it('should have toolbar defined', () => {
                expect(directiveCtrl.toolbar).toBeDefined();
            });

            it('should have the title as Great', () => {
                let title = angular.element(directiveElem.find('.list-title > .md-toolbar-tools > span')).text();
                expect(title).toEqual("Great");
            });

            it('should have icon account_circle', () => {
                let title = angular.element(directiveElem.find('.list-title > .md-toolbar-tools > i')).text();
                expect(title).toEqual("account_circle");
            });
        });

        describe('pagination test', () => {
            beforeEach(() => {
                $scope.totalNumber = 24;
                $scope.items = _.times(5, () => {
                    return $scope.items;
                });
                $scope.$digest();
            });

            describe('desktop', () => {
                beforeEach(() => {
                    directiveCtrl.model.forceDesktop = true;
                    $scope.$digest();
                });

                it('should return the limit from getLimitTo()', () => {
                    directiveCtrl.model.forceMobile = true;
                    directiveCtrl.model.forceDesktop = false;
                    $scope.$digest();
                    expect(directiveCtrl.getLimitTo()).toEqual(3);
                });

                it('should pagination element', () => {
                    let el = directiveElem.find('ttmd-pagination-desktop');
                    expect(el.length).toEqual(1);
                });

                it('should have three pages', () => {
                    let a = directiveElem.find('ttmd-pagination-desktop a');
                    expect(a.length).toEqual(3);
                });
            });

            describe('mobile', () => {
                beforeEach(() => {
                    directiveCtrl.model.forceDesktop = false;
                    $scope.$digest();
                });

                it('should return the limit from getLimitTo()', () => {
                    expect(directiveCtrl.getLimitTo()).toEqual(3);
                });

                it('should pagination element', () => {
                    let el = directiveElem.find('ttmd-pagination-mobile');
                    expect(el.length).toEqual(1);
                });

                it('should have tow pagination buttons', () => {
                    let el = directiveElem.find('ttmd-pagination-mobile button');
                    expect(el.length).toEqual(2);
                });
            })
        });


        function getCompiledElement() {

            $scope.items = [
                {
                    "id": 0,
                    "serviceCode": "1-260-865-6252 x638",
                    "username": "Milton Mraz",
                    "amount": "8.03",
                    "dueDate": "2016-05-20T05:15:02.719Z"
                },
                {
                    "id": 1,
                    "serviceCode": "1-965-662-5118",
                    "username": "Alessandro Kassulke",
                    "amount": "8.61",
                    "dueDate": "2016-06-25T19:15:02.720Z"
                },
                {
                    "id": 2,
                    "serviceCode": "584.888.7204 x0056",
                    "username": "Florence Ratke",
                    "amount": "5.90",
                    "dueDate": "2016-06-12T12:15:02.720Z"
                },
                {
                    "id": 3,
                    "serviceCode": "740-104-2718",
                    "username": "Hilda Kerluke",
                    "amount": "14.42",
                    "dueDate": "2016-06-13T16:15:02.720Z"
                }
            ];

            $scope.headers = [
                'id',
                'number',
                'username',
                'amount',
                'due date'
            ];

            $scope.toolbar = undefined;
            $scope.totalNumber = undefined;
            $scope.sort = undefined;
            $scope.exclude = undefined;
            $scope.forceMobile = undefined;

            var compiledDirective = $compile(angular.element('<ttmd-table force-mobile="forceMobile" exclude="exclude" items="items" headers="headers" toolbar="toolbar" sort="sort" total-number="totalNumber"><ttmd-actions><ttmd-action text="pay"></ttmd-action></ttmd-actions></ttmd-table>'))($scope);
            $scope.$digest();
            return compiledDirective;
        }
    });
};
